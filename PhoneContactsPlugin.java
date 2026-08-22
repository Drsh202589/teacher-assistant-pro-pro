package com.mostafaelderey.phonecontacts;

import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.ContactsContract;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "PhoneContacts")
public class PhoneContactsPlugin extends Plugin {

    private PluginCall pendingCall;

    private final androidx.activity.result.ActivityResultCallback<ActivityResult> contactPickerCallback = result -> {
        PluginCall call = pendingCall;
        pendingCall = null;

        if (call == null) return;

        if (result == null || result.getResultCode() != Activity.RESULT_OK || result.getData() == null) {
            call.reject("CANCELLED");
            return;
        }

        Uri contactUri = result.getData().getData();
        if (contactUri == null) {
            call.reject("CONTACT_NOT_FOUND");
            return;
        }

        String name = "";
        String phone = "";
        Cursor cursor = null;
        try {
            String[] projection = new String[] {
                    ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME,
                    ContactsContract.CommonDataKinds.Phone.NUMBER
            };
            cursor = getContext().getContentResolver().query(contactUri, projection, null, null, null);
            if (cursor != null && cursor.moveToFirst()) {
                int nameIndex = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME);
                int phoneIndex = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER);
                if (nameIndex >= 0) name = cursor.getString(nameIndex);
                if (phoneIndex >= 0) phone = cursor.getString(phoneIndex);
            }
        } catch (SecurityException e) {
            call.reject("DENIED");
            return;
        } catch (Exception e) {
            call.reject("CONTACT_READ_FAILED", e);
            return;
        } finally {
            if (cursor != null) cursor.close();
        }

        if (phone == null || phone.trim().isEmpty()) {
            call.reject("NO_PHONE_NUMBER");
            return;
        }

        JSObject resultObject = new JSObject();
        resultObject.put("name", name == null ? "" : name);
        resultObject.put("phone", phone);
        call.resolve(resultObject);
    };

    @PluginMethod
    public void pickPhoneContact(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_PICK);
        intent.setData(ContactsContract.CommonDataKinds.Phone.CONTENT_URI);
        intent.setType(ContactsContract.CommonDataKinds.Phone.CONTENT_TYPE);
        startActivityForResult(call, intent, "handleContactPickerResult");
    }

    @com.getcapacitor.annotation.ActivityCallback
    private void handleContactPickerResult(PluginCall call, ActivityResult result) {
        if (call == null) return;

        if (result == null || result.getResultCode() != Activity.RESULT_OK || result.getData() == null) {
            call.reject("CANCELLED");
            return;
        }

        Uri contactUri = result.getData().getData();
        if (contactUri == null) {
            call.reject("CONTACT_NOT_FOUND");
            return;
        }

        String name = "";
        String phone = "";
        Cursor cursor = null;
        try {
            String[] projection = new String[] {
                    ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME,
                    ContactsContract.CommonDataKinds.Phone.NUMBER
            };
            cursor = getContext().getContentResolver().query(contactUri, projection, null, null, null);
            if (cursor != null && cursor.moveToFirst()) {
                int nameIndex = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME);
                int phoneIndex = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER);
                if (nameIndex >= 0) name = cursor.getString(nameIndex);
                if (phoneIndex >= 0) phone = cursor.getString(phoneIndex);
            }
        } catch (SecurityException e) {
            call.reject("DENIED");
            return;
        } catch (Exception e) {
            call.reject("CONTACT_READ_FAILED", e);
            return;
        } finally {
            if (cursor != null) cursor.close();
        }

        if (phone == null || phone.trim().isEmpty()) {
            call.reject("NO_PHONE_NUMBER");
            return;
        }

        JSObject resultObject = new JSObject();
        resultObject.put("name", name == null ? "" : name);
        resultObject.put("phone", phone);
        call.resolve(resultObject);
    }

}
