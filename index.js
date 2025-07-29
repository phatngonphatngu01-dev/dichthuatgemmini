<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Trợ Lý Dịch Khai Thị - Giao diện mới</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* General styling */
        body { 
            font-family: 'Inter', sans-serif; 
            overscroll-behavior: none; /* Prevents pull-to-refresh on mobile */
        }

        /* Custom scrollbar for a cleaner look */
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c4c4c4;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }

        /* Styling for the loader animation inside the button */
        .loader {
            border-top-color: #ffffff;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Styling for the toast notification */
        .toast {
            visibility: hidden;
            min-width: 250px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 8px;
            padding: 16px;
            position: fixed;
            z-index: 100;
            left: 50%;
            transform: translateX(-50%);
            bottom: 100px; /* Positioned above the bottom nav */
            opacity: 0;
            transition: opacity 0.5s, visibility 0.5s, bottom 0.5s;
        }
        .toast.show {
            visibility: visible;
            opacity: 1;
        }

        /* Styling for the modal */
        .modal {
            transition: opacity 0.25s ease;
        }
    </style>
</head>
<body class="bg-[#f0f2f5] text-gray-800 h-screen w-screen overflow-hidden flex flex-col">

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden p-3 pb-0">
        <header class="text-center mb-3 shrink-0">
            <h1 class="text-xl font-bold text-teal-700">Trợ Lý Dịch Khai Thị</h1>
        </header>

        <!-- Container for the two text areas -->
        <div class="flex-1 grid grid-rows-2 gap-3 overflow-hidden">
            <!-- Chinese Input Area -->
            <div class="bg-white rounded-xl shadow-sm flex flex-col overflow-hidden">
                <div class="flex justify-between items-center p-2 border-b border-gray-200 shrink-0">
                    <label for="chinese-text" class="text-sm font-semibold text-gray-600">Văn bản gốc (Tiếng Trung)</label>
                    <button id="clear-button" class="text-xs text-red-500 hover:bg-red-50 rounded-md p-1.5 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
                <textarea id="chinese-text" class="w-full h-full p-3 text-base bg-transparent focus:outline-none resize-none custom-scrollbar" placeholder="Nhập hoặc dán văn bản tiếng Trung..."></textarea>
            </div>

            <!-- Vietnamese Output Area -->
            <div class="bg-white rounded-xl shadow-sm flex flex-col overflow-hidden">
                <label id="vietnamese-output-label" class="text-sm font-semibold text-gray-600 p-2 border-b border-gray-200 shrink-0">Bản dịch (Tiếng Việt)</label>
                <div id="vietnamese-text"
                     role="status"
                     aria-live="polite"
                     aria-labelledby="vietnamese-output-label"
                     class="w-full h-full p-3 text-base overflow-y-auto whitespace-pre-wrap custom-scrollbar"></div>
            </div>
        </div>
    </div>

    <!-- Fixed Bottom Navigation Menu -->
    <nav class="w-full bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.05)] shrink-0">
        <div class="max-w-md mx-auto grid grid-cols-3 gap-2 p-3">
            <!-- About Button -->
            <button id="about-button" class="flex flex-col items-center justify-center text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-1"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span class="text-xs font-medium">Giới thiệu</span>
            </button>

            <!-- Translate Button (Primary Action) -->
            <button id="translate-button" class="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center text-sm py-3 px-4">
                <svg id="loader" class="loader ease-linear rounded-full border-2 border-t-2 border-gray-200 h-5 w-5 mr-2 hidden" viewBox="0 0 24 24"></svg>
                <span id="button-text">Dịch văn bản</span>
            </button>
            
            <!-- Copy Button -->
            <button id="copy-button" class="flex flex-col items-center justify-center text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-1"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <span class="text-xs font-medium">Sao chép</span>
            </button>
        </div>
    </nav>
    
    <!-- Toast Notification -->
    <div id="toast" class="toast"></div>

    <!-- About Modal -->
    <div id="about-modal" class="modal fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-50 p-4 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-auto p-6 text-center">
            <h3 id="modal-title" class="text-lg font-bold text-teal-700 mb-4">Lời ngỏ</h3>
            <p class="text-sm text-gray-600 italic leading-relaxed">
                🙏🙏🙏 Vì tâm nguyện con muốn hoằng dương Pháp Môn Tâm Linh, mang những lời dạy quý giá của Sư Phụ Lư Quân Hoành đến gần hơn với tất cả mọi người, con đã xây dựng ứng dụng này! Trong quá trình hoằng pháp nếu con có gì sai sót, không Đúng Lý Đúng Pháp, Con xin Chư Phật, Chư Bồ Tát, Chư Thần Hộ Pháp, Từ Bi tha thứ cho con.
            </p>
            <button id="close-modal-button" class="mt-6 bg-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors">
                Đã hiểu
            </button>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Get references to all interactive elements
            const translateButton = document.getElementById('translate-button');
            const chineseTextArea = document.getElementById('chinese-text');
            const vietnameseOutputDiv = document.getElementById('vietnamese-text');
            const copyButton = document.getElementById('copy-button');
            const clearButton = document.getElementById('clear-button');
            const loader = document.getElementById('loader');
            const buttonText = document.getElementById('button-text');
            const toast = document.getElementById('toast');
            
            // Modal elements
            const aboutButton = document.getElementById('about-button');
            const aboutModal = document.getElementById('about-modal');
            const closeModalButton = document.getElementById('close-modal-button');

            // --- Functionality ---

            // Function to show toast notifications
            const showToast = (message) => {
                toast.textContent = message;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            };

            // Event listener for the clear button
            clearButton.addEventListener('click', () => {
                chineseTextArea.value = '';
                vietnameseOutputDiv.textContent = '';
                showToast('Đã xóa nội dung.');
            });
            
            // Event listener for the translate button
            translateButton.addEventListener('click', async () => {
                const chineseText = chineseTextArea.value.trim();
                if (!chineseText) {
                    showToast("Vui lòng nhập văn bản tiếng Trung.");
                    return;
                }
                
                // Update UI to show loading state
                loader.classList.remove('hidden');
                buttonText.textContent = 'Đang dịch...';
                translateButton.disabled = true;
                vietnameseOutputDiv.textContent = ''; 
                vietnameseOutputDiv.style.color = 'inherit';

                try {
                    // This is a placeholder for your actual API call.
                    // Replace '/api/translate' with your actual endpoint if needed.
                    const response = await fetch('/api/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chineseText: chineseText })
                    });
                    
                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || `Lỗi không xác định từ server (Mã: ${response.status})`);
                    }
                    
                    vietnameseOutputDiv.textContent = data.translation;

                } catch (error) {
                    console.error("Lỗi chi tiết khi dịch:", error);
                    vietnameseOutputDiv.textContent = `Đã xảy ra lỗi khi dịch. Vui lòng thử lại sau.\n\nChi tiết: ${error.message}`;
                    vietnameseOutputDiv.style.color = 'red';
                    showToast("Đã có lỗi xảy ra. Vui lòng thử lại.");
                } finally {
                    // Restore UI after translation attempt
                    loader.classList.add('hidden');
                    buttonText.textContent = 'Dịch văn bản';
                    translateButton.disabled = false;
                }
            });

            // Event listener for the copy button
            copyButton.addEventListener('click', () => {
                const chineseText = chineseTextArea.value.trim();
                const vietnameseText = vietnameseOutputDiv.textContent.trim();

                if (!chineseText && !vietnameseText) {
                    showToast("Không có nội dung để sao chép.");
                    return;
                }

                const textToCopy = `Bản gốc:\n${chineseText}\n\nBản dịch:\n${vietnameseText}`;
                
                // Use a temporary textarea to perform the copy command
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px"; // Move it off-screen
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    showToast("Đã sao chép bản gốc và bản dịch!");
                } catch (err) {
                    console.error('Không thể sao chép: ', err);
                    showToast("Lỗi! Không thể sao chép.");
                }
                document.body.removeChild(textArea);
            });

            // --- Modal Logic ---

            // Show modal
            aboutButton.addEventListener('click', () => {
                aboutModal.classList.remove('hidden');
                aboutModal.classList.add('flex');
            });

            // Hide modal
            const hideModal = () => {
                aboutModal.classList.add('hidden');
                aboutModal.classList.remove('flex');
            };

            closeModalButton.addEventListener('click', hideModal);
            
            // Also hide modal if user clicks on the background overlay
            aboutModal.addEventListener('click', (event) => {
                if (event.target === aboutModal) {
                    hideModal();
                }
            });
        });
    </script>
</body>
</html>
