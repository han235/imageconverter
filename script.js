document.getElementById('image-input').addEventListener('change', handleFileSelect, false);
document.getElementById('convert-button').addEventListener('click', uploadAndConvertImages, false);

function handleFileSelect(event) {
    const files = event.target.files;
    const list = document.getElementById('image-list');
    list.innerHTML = '';

    for (const file of files) {
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        list.appendChild(listItem);
    }
}

async function uploadAndConvertImages() {
    const inputElement = document.getElementById('image-input');
    const formData = new FormData();

    for (const file of inputElement.files) {
        formData.append('images', file, file.name);
    }

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const downloadLink = document.getElementById('download-link');
            downloadLink.href = downloadUrl;
            downloadLink.download = 'converted_images.zip';
            downloadLink.style.display = 'inline';
            downloadLink.click();
        } else {
            console.error('서버에서 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('요청을 보내는 중 오류가 발생했습니다: ', error);
    }
}
