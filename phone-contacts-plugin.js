import { registerPlugin } from '@capacitor/core';

export const PhoneContacts = registerPlugin('PhoneContacts', {
  web: () => ({
    async pickPhoneContact() {
      if (navigator.contacts && typeof navigator.contacts.select === 'function') {
        const selected = await navigator.contacts.select(['name', 'tel'], { multiple: false });
        const c = selected && selected[0];
        if (!c) throw new Error('CANCELLED');
        const phone = Array.isArray(c.tel) ? c.tel[0] : '';
        return { name: c.name || '', phone: phone || '' };
      }
      throw new Error('CONTACT_PICKER_UNAVAILABLE');
    }
  })
});

if (typeof window !== 'undefined') window.PhoneContacts = PhoneContacts;
