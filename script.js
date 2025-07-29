document.addEventListener('DOMContentLoaded', () => {
    const contactList = document.getElementById('contactList');
    const addContactBtn = document.getElementById('addContactBtn');
    const contactModal = document.getElementById('contactModal');
    const closeModal = document.getElementById('closeModal');
    const contactForm = document.getElementById('contactForm');
    const saveContactBtn = document.getElementById('saveContactBtn');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const contactViewModal = document.getElementById('contactViewModal');
    const closeViewModal = document.getElementById('closeViewModal');
    const viewContactSerial = document.getElementById('viewContactSerial');
    const viewContactName = document.getElementById('viewContactName');
    const viewContactPhone = document.getElementById('viewContactPhone');
    const viewContactEmail = document.getElementById('viewContactEmail');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const editContactBtn = document.getElementById('editContactBtn');
    const deleteContactBtn = document.getElementById('deleteContactBtn');

    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    let currentPage = 1;
    const itemsPerPage = 5;
    let contactToDelete = null;
    let contactToView = null;

    const saveContacts = () => {
        localStorage.setItem('contacts', JSON.stringify(contacts));
    };

    const renderContacts = () => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const sortedContacts = [...contacts].sort((a, b) => {
            const sortBy = sortSelect.value;
            return a[sortBy].localeCompare(b[sortBy]);
        });

        const paginatedContacts = sortedContacts.slice(start, end);
        contactList.innerHTML = '';

        paginatedContacts.forEach((contact, index) => {
            const contactItem = document.createElement('div');
            contactItem.className = 'contact-item';
            contactItem.innerHTML = `
                <div class="info" data-index="${start + index}">
                    <strong>${start + index + 1}</strong>
                    <div>
                        <span class="detail-label">Name:</span>
                        <span>${contact.name}</span>
                    </div>
                    <div>
                        <span class="detail-label">Phone:</span>
                        <span>${contact.phone}</span>
                    </div>
                    <div>
                        <span class="detail-label">Email:</span>
                        <span>${contact.email}</span>
                    </div>
                </div>
                <div class="actions">
                    <button class="view btn primary" data-index="${start + index}">View</button>
                    <button class="edit btn secondary" data-index="${start + index}">Edit</button>
                    <button class="delete btn danger" data-index="${start + index}">Delete</button>
                </div>
            `;
            contactList.appendChild(contactItem);
        });

        pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(sortedContacts.length / itemsPerPage)}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === Math.ceil(sortedContacts.length / itemsPerPage);
    };

    const addContact = (contact) => {
        contacts.push(contact);
        saveContacts();
        renderContacts();
    };

    const updateContact = (index, updatedContact) => {
        contacts[index] = updatedContact;
        saveContacts();
        renderContacts();
    };

    const deleteContact = () => {
        if (contactToDelete !== null) {
            contacts.splice(contactToDelete, 1);
            saveContacts();
            renderContacts();
            contactToDelete = null;
            confirmationModal.style.display = 'none';
        }
    };

    const confirmDelete = (index) => {
        contactToDelete = index;
        confirmationModal.style.display = 'flex';
    };

    const editContact = (index) => {
        const contact = contacts[index];
        document.getElementById('contactId').value = index;
        document.getElementById('name').value = contact.name;
        document.getElementById('phone').value = contact.phone;
        document.getElementById('email').value = contact.email;
        document.getElementById('modalTitle').textContent = 'Edit Contact';
        contactModal.style.display = 'flex';
        saveContactBtn.textContent = 'Update Contact';
    };

    const viewContact = (index) => {
        const contact = contacts[index];
        viewContactSerial.textContent = index + 1;
        viewContactName.textContent = contact.name;
        viewContactPhone.textContent = contact.phone;
        viewContactEmail.textContent = contact.email;
        contactToView = index;
        contactViewModal.style.display = 'flex';
    };

    const clearContactModal = () => {
        document.getElementById('modalTitle').textContent = 'Add Contact';
        document.getElementById('contactForm').reset();
        document.getElementById('contactId').value = '';
        saveContactBtn.textContent = 'Save Contact';
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('contactId').value;
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const contact = { name, phone, email };

        if (id) {
            updateContact(parseInt(id), contact);
        } else {
            addContact(contact);
        }

        contactModal.style.display = 'none';
        clearContactModal();
    });

    addContactBtn.addEventListener('click', () => {
        clearContactModal();
        contactModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        contactModal.style.display = 'none';
        clearContactModal();
    });

    closeViewModal.addEventListener('click', () => {
        contactViewModal.style.display = 'none';
        contactToView = null;
    });

    confirmDeleteBtn.addEventListener('click', () => {
        deleteContact();
        confirmationModal.style.display = 'none';
    });

    cancelDeleteBtn.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
        contactToDelete = null;
    });

    editContactBtn.addEventListener('click', () => {
        editContact(contactToView);
        contactViewModal.style.display = 'none';
    });

    deleteContactBtn.addEventListener('click', () => {
        confirmDelete(contactToView);
        contactViewModal.style.display = 'none';
    });

    window.onclick = (event) => {
        if (event.target === contactModal) {
            contactModal.style.display = 'none';
            clearContactModal();
        } else if (event.target === contactViewModal) {
            contactViewModal.style.display = 'none';
            contactToView = null;
        } else if (event.target === confirmationModal) {
            confirmationModal.style.display = 'none';
            contactToDelete = null;
        }
    };

    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.trim().toLowerCase();
        const filteredContacts = contacts.filter(contact => 
            contact.name.toLowerCase().includes(searchText) ||
            contact.phone.toLowerCase().includes(searchText) ||
            contact.email.toLowerCase().includes(searchText)
        );
        renderFilteredContacts(filteredContacts);
    });

    const renderFilteredContacts = (filteredContacts) => {
        contactList.innerHTML = '';

        filteredContacts.forEach((contact, index) => {
            const contactItem = document.createElement('div');
            contactItem.className = 'contact-item';
            contactItem.innerHTML = `
                <div class="info" data-index="${index}">
                    <strong>${index + 1}</strong>
                    <div>
                        <span class="detail-label">Name:</span>
                        <span>${contact.name}</span>
                    </div>
                    <div>
                        <span class="detail-label">Phone:</span>
                        <span>${contact.phone}</span>
                    </div>
                    <div>
                        <span class="detail-label">Email:</span>
                        <span>${contact.email}</span>
                    </div>
                </div>
                <div class="actions">
                    <button class="view btn primary" data-index="${index}">View</button>
                    <button class="edit btn secondary" data-index="${index}">Edit</button>
                    <button class="delete btn danger" data-index="${index}">Delete</button>
                </div>
            `;
            contactList.appendChild(contactItem);
        });

        pageInfo.textContent = 'Filtered Search';
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
    };

    sortSelect.addEventListener('change', renderContacts);

    prevPageBtn.addEventListener('click', () => {
        currentPage--;
        renderContacts();
    });

    nextPageBtn.addEventListener('click', () => {
        currentPage++;
        renderContacts();
    });

    contactList.addEventListener('click', (e) => {
        const target = e.target;
        const index = target.closest('.contact-item').querySelector('.info').getAttribute('data-index');
        if (target.classList.contains('edit')) {
            editContact(index);
        } else if (target.classList.contains('delete')) {
            confirmDelete(index);
        } else if (target.classList.contains('view')) {
            viewContact(index);
        }
    });

    renderContacts();
});
