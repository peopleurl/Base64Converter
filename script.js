document.addEventListener('DOMContentLoaded', function() {
    // 标签切换功能
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab') + '-tab';

            // 移除所有激活状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // 添加当前激活状态
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // 文本编码功能
    const textInput = document.getElementById('text-input');
    const textOutput = document.getElementById('text-output');
    const encodeTextBtn = document.getElementById('encode-text');
    const decodeTextBtn = document.getElementById('decode-text');
    const copyTextOutputBtn = document.getElementById('copy-text-output');

    encodeTextBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (text) {
            try {
                const encoded = btoa(unescape(encodeURIComponent(text)));
                textOutput.value = encoded;
            } catch (error) {
                alert('编码出错: ' + error.message);
            }
        } else {
            alert('请输入要编码的文本');
        }
    });

    decodeTextBtn.addEventListener('click', () => {
        const encodedText = textOutput.value.trim() || textInput.value.trim();
        if (encodedText) {
            try {
                const decoded = decodeURIComponent(escape(atob(encodedText)));
                textOutput.value = decoded;
            } catch (error) {
                alert('解码出错: ' + error.message);
            }
        } else {
            alert('请输入要解码的Base64字符串');
        }
    });

    // 图片转Base64功能
    const imageInput = document.getElementById('image-input');
    const imagePreview = document.getElementById('image-preview');
    const imageOutput = document.getElementById('image-output');
    const copyImageOutputBtn = document.getElementById('copy-image-output');

    imageInput.addEventListener('change', handleImageUpload);

    // 拖放功能
    const imageUploadContainer = document.querySelector('.image-upload-container');

    imageUploadContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadContainer.style.borderColor = '#4a6cf7';
        imageUploadContainer.style.backgroundColor = 'rgba(74, 108, 247, 0.05)';
    });

    imageUploadContainer.addEventListener('dragleave', () => {
        imageUploadContainer.style.borderColor = '#e1e4e8';
        imageUploadContainer.style.backgroundColor = 'transparent';
    });

    imageUploadContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadContainer.style.borderColor = '#e1e4e8';
        imageUploadContainer.style.backgroundColor = 'transparent';

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            imageInput.files = e.dataTransfer.files;
            handleImageUpload();
        }
    });

    function handleImageUpload() {
        const file = imageInput.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    imageOutput.value = e.target.result;
                };

                reader.readAsDataURL(file);
            } else {
                alert('请上传有效的图片文件');
            }
        }
    }

    // Base64转图片功能
    const base64Input = document.getElementById('base64-input');
    const convertedImage = document.getElementById('converted-image');
    const convertToImageBtn = document.getElementById('convert-to-image');
    const downloadImageBtn = document.getElementById('download-image');

    convertToImageBtn.addEventListener('click', () => {
        const base64String = base64Input.value.trim();
        if (base64String) {
            try {
                // 检查是否是有效的Base64图片
                if (base64String.startsWith('data:image/')) {
                    convertedImage.src = base64String;
                    convertedImage.style.display = 'block';
                    downloadImageBtn.disabled = false;
                } else {
                    // 尝试添加前缀
                    const testSrc = 'data:image/png;base64,' + base64String;
                    convertedImage.src = testSrc;
                    convertedImage.style.display = 'block';
                    downloadImageBtn.disabled = false;
                }
            } catch (error) {
                alert('转换出错: ' + error.message);
            }
        } else {
            alert('请输入Base64编码');
        }
    });

    downloadImageBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'converted-image.png';
        link.href = convertedImage.src;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 复制功能
    copyTextOutputBtn.addEventListener('click', () => copyToClipboard(textOutput.value));
    copyImageOutputBtn.addEventListener('click', () => copyToClipboard(imageOutput.value));

    function copyToClipboard(text) {
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                showCopyNotification();
            }).catch(err => {
                alert('复制失败: ' + err);
            });
        }
    }

    // 显示复制成功通知
    function showCopyNotification() {
        // 检查是否已存在通知元素
        let notification = document.querySelector('.copy-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'copy-notification';
            notification.textContent = '复制成功!';
            document.body.appendChild(notification);
        }

        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
});