let requests = JSON.parse(localStorage.getItem("requests")) || [];

let currentLanguage = "en";

const translations = {
    en: {
        appTitle: "Student Service Dashboard",
        appSubtitle: "Manage student service requests easily",
        language: "বাংলা",
        total: "Total Requests",
        pending: "Pending",
        processing: "Processing",
        completed: "Completed",
        formTitle: "Add New Request",
        studentName: "Student Name",
        studentId: "Student ID",
        requestType: "Request Type",
        priority: "Priority",
        description: "Description",
        addRequest: "Add Request",
        listTitle: "All Requests",
        search: "Search by name or ID...",
        name: "Name",
        id: "ID",
        type: "Type",
        status: "Status",
        action: "Action",
        empty: "No requests found.",
        delete: "Delete"
    },

    bn: {
        appTitle: "শিক্ষার্থী সেবা ড্যাশবোর্ড",
        appSubtitle: "শিক্ষার্থীদের সেবা অনুরোধ সহজে পরিচালনা করুন",
        language: "English",
        total: "মোট অনুরোধ",
        pending: "অপেক্ষমাণ",
        processing: "প্রক্রিয়াধীন",
        completed: "সম্পন্ন",
        formTitle: "নতুন অনুরোধ যোগ করুন",
        studentName: "শিক্ষার্থীর নাম",
        studentId: "শিক্ষার্থী আইডি",
        requestType: "অনুরোধের ধরন",
        priority: "অগ্রাধিকার",
        description: "বিবরণ",
        addRequest: "অনুরোধ যোগ করুন",
        listTitle: "সকল অনুরোধ",
        search: "নাম বা আইডি দিয়ে খুঁজুন...",
        name: "নাম",
        id: "আইডি",
        type: "ধরন",
        status: "অবস্থা",
        action: "অ্যাকশন",
        empty: "কোনো অনুরোধ পাওয়া যায়নি।",
        delete: "মুছে ফেলুন"
    }
};

const form = document.getElementById("requestForm");
const tableBody = document.getElementById("requestTableBody");
const searchInput = document.getElementById("searchInput");
const languageBtn = document.getElementById("languageBtn");

function saveRequests() {
    localStorage.setItem("requests", JSON.stringify(requests));
}

function renderRequests() {

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredRequests = requests.filter(request =>
        request.name.toLowerCase().includes(searchText) ||
        request.studentId.toLowerCase().includes(searchText)
    );

    tableBody.innerHTML = "";

    document.getElementById("emptyMessage").style.display =
        filteredRequests.length === 0 ? "block" : "none";

    filteredRequests.forEach(request => {

        const row = document.createElement("tr");

        const statusClass = request.status.toLowerCase();

        row.innerHTML = `
            <td>${request.name}</td>
            <td>${request.studentId}</td>
            <td>${request.type}</td>
            <td>${request.priority}</td>

            <td>
                <select onchange="changeStatus(${request.id}, this.value)">
                    <option value="Pending" ${request.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="Processing" ${request.status === "Processing" ? "selected" : ""}>
                        Processing
                    </option>

                    <option value="Completed" ${request.status === "Completed" ? "selected" : ""}>
                        Completed
                    </option>
                </select>
            </td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteRequest(${request.id})">
                    ${translations[currentLanguage].delete}
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    updateStatistics();
}

function updateStatistics() {

    const total = requests.length;

    const pending = requests.filter(
        request => request.status === "Pending"
    ).length;

    const processing = requests.filter(
        request => request.status === "Processing"
    ).length;

    const completed = requests.filter(
        request => request.status === "Completed"
    ).length;

    document.getElementById("totalRequests").textContent = total;
    document.getElementById("pendingRequests").textContent = pending;
    document.getElementById("processingRequests").textContent = processing;
    document.getElementById("completedRequests").textContent = completed;
}

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const newRequest = {
        id: Date.now(),
        name: document.getElementById("studentName").value.trim(),
        studentId: document.getElementById("studentId").value.trim(),
        type: document.getElementById("requestType").value,
        priority: document.getElementById("priority").value,
        description: document.getElementById("description").value.trim(),
        status: "Pending"
    };

    requests.push(newRequest);

    saveRequests();

    form.reset();

    renderRequests();
});

function deleteRequest(id) {

    requests = requests.filter(request => request.id !== id);

    saveRequests();

    renderRequests();
}

function changeStatus(id, newStatus) {

    const request = requests.find(request => request.id === id);

    if (request) {
        request.status = newStatus;
    }

    saveRequests();

    renderRequests();
}

searchInput.addEventListener("input", renderRequests);

function updateLanguage() {

    const text = translations[currentLanguage];

    document.getElementById("appTitle").textContent = text.appTitle;
    document.getElementById("appSubtitle").textContent = text.appSubtitle;

    languageBtn.textContent = text.language;

    document.getElementById("totalLabel").textContent = text.total;
    document.getElementById("pendingLabel").textContent = text.pending;
    document.getElementById("processingLabel").textContent = text.processing;
    document.getElementById("completedLabel").textContent = text.completed;

    document.getElementById("formTitle").textContent = text.formTitle;
    document.getElementById("nameLabel").textContent = text.studentName;
    document.getElementById("idLabel").textContent = text.studentId;
    document.getElementById("typeLabel").textContent = text.requestType;
    document.getElementById("priorityLabel").textContent = text.priority;
    document.getElementById("descriptionLabel").textContent = text.description;

    document.getElementById("addBtn").textContent = text.addRequest;

    document.getElementById("listTitle").textContent = text.listTitle;

    searchInput.placeholder = text.search;

    document.getElementById("thName").textContent = text.name;
    document.getElementById("thId").textContent = text.id;
    document.getElementById("thType").textContent = text.type;
    document.getElementById("thPriority").textContent = text.priority;
    document.getElementById("thStatus").textContent = text.status;
    document.getElementById("thAction").textContent = text.action;

    document.getElementById("emptyMessage").textContent = text.empty;

    renderRequests();
}

languageBtn.addEventListener("click", function() {

    currentLanguage = currentLanguage === "en" ? "bn" : "en";

    updateLanguage();
});

renderRequests();