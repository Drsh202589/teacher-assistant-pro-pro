(function () {
  const capacitor = window.Capacitor;

  const webImplementation = () => ({
    async pickPhoneContact() {
      if (navigator.contacts && typeof navigator.contacts.select === 'function') {
        const selected = await navigator.contacts.select(['name', 'tel'], { multiple: false });
        const c = selected && selected[0];
        if (!c) throw new Error('CANCELLED');
        const phone = Array.isArray(c.tel) ? c.tel[0] : '';
        return { name: Array.isArray(c.name) ? c.name[0] : (c.name || ''), phone: phone || '' };
      }
      throw new Error('CONTACT_PICKER_UNAVAILABLE');
    }
  });

  const PhoneContacts = capacitor && typeof capacitor.registerPlugin === 'function'
    ? capacitor.registerPlugin('PhoneContacts', { web: webImplementation })
    : { pickPhoneContact: webImplementation().pickPhoneContact };

  window.PhoneContacts = PhoneContacts;
})();
