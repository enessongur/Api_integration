const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");
const userList = document.getElementById("userList");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const userIdInput = document.getElementById("userId");
const getUserButton = document.getElementById("getUser");
const userInfo = document.getElementById("userInfo");
const userForm = document.getElementById("userForm");
const responseMessage = document.getElementById("responseMessage");

let currentPage = 1;

// Hata mesajını göstermek için bir fonksiyon
function showError(message) {
    errorMessage.innerHTML = message;
    errorMessage.style.display = "block";
}

// Başarı mesajını göstermek için bir fonksiyon
function showSuccess(message) {
    successMessage.innerHTML = message;
    successMessage.style.display = "block";
}

// Veriyi çekmek için bir fonksiyon
function fetchData(page) {
    fetch(`https://reqres.in/api/users?page=${page}`)
        .then(response => response.json())
        .then(data => {
            userList.innerHTML = "";
            data.data.forEach(user => {
                const userItem = document.createElement("li");
                userItem.className = "user-item";
                userItem.innerHTML = `
                        <strong>ID:</strong> ${user.id}<br>
                        <strong>Ad:</strong> ${user.first_name}<br>
                        <strong>Soyad:</strong> ${user.last_name}<br>
                        <strong>Email:</strong> ${user.email}<br>
                        <img src="${user.avatar}" alt="${user.first_name}">
                    `;
                userList.appendChild(userItem);
            });
        })
        .catch(error => {
            showError("Veri çekme hatası: " + error.message);
        });
}

// Sayfa yükleme işlemini gerçekleştiren fonksiyon
function loadPage(page) {
    currentPage = page;
    fetchData(currentPage);
}

// Önceki sayfa düğmesine tıklama olayını ekleyin
prevPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
        loadPage(currentPage - 1);
    }
});
// Sonraki sayfa düğmesine tıklama olayını ekleyin
nextPageButton.addEventListener("click", () => {
    loadPage(currentPage + 1);
});

// Kullanıcıyı Getir düğmesine tıklama olayını ekleyin
getUserButton.addEventListener("click", () => {
    const userId = userIdInput.value;

    if (!userId) {
        showError("Lütfen bir kullanıcı ID'si girin.");
        return;
    }

    fetch(`https://reqres.in/api/users/${userId}`)
        .then(response => {
            if (response.status === 404) {
                showError("Kullanıcı bulunamadı.");
                throw new Error("Kullanıcı bulunamadı.");
            }
            return response.json();
        })
        .then(data => {
            showSuccess("Kullanıcı başarıyla getirildi.");
            userInfo.innerHTML = `
                    <strong>ID:</strong> ${data.data.id}<br>
                    <strong>Ad:</strong> ${data.data.first_name}<br>
                    <strong>Soyad:</strong> ${data.data.last_name}<br>
                    <strong>Email:</strong> ${data.data.email}<br>
                    <img src="${data.data.avatar}" alt="${data.data.first_name}">
                `;
        })
        .catch(error => {
            showError("Hata: " + error.message);
        });
});

// Form gönderme işlemi
userForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(userForm);

    fetch("https://reqres.in/api/users", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            showSuccess("Veri başarıyla gönderildi.");
            responseMessage.innerHTML = `Kullanıcı Adı: ${data.name}<br>
                                        İş: ${data.job}<br>
                                        ID: ${data.id}<br>
                                        Oluşturulma Tarihi: ${data.createdAt}`;
        })
        .catch(error => {
            showError("Hata oluştu: " + error.message);
        });
});

// Sayfa başlangıcında veriyi yükle
loadPage(currentPage);