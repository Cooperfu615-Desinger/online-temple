import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';

export default function ResultModal({ isOpen, result, deityName, onClose }) {
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const modalRef = useRef(null);

    if (!isOpen || !result) return null;

    const getLevelClass = (level) => {
        if (level.includes('下')) {
            return "text-xl text-white bg-gray-600 px-6 py-1 rounded shadow-inner tracking-[0.5em] font-serif";
        } else if (level.includes('吉')) {
            return "text-xl text-white bg-red-800 px-6 py-1 rounded shadow-inner tracking-[0.5em] font-serif";
        } else {
            return "text-xl text-white bg-amber-700 px-6 py-1 rounded shadow-inner tracking-[0.5em] font-serif";
        }
    };

    const handleSaveImage = async () => {
        if (!modalRef.current || isSaving) return;

        setIsSaving(true);

        try {
            // 使用 html-to-image，Safari 相容性更好
            const dataUrl = await toPng(modalRef.current, {
                backgroundColor: '#fff9e6',
                pixelRatio: 2,
                cacheBust: true,
            });

            // 創建下載連結
            const link = document.createElement('a');
            link.download = `${deityName}靈籤_${result.title}.png`;
            link.href = dataUrl;

            // Safari 需要先添加到 DOM 再點擊
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // 標記已儲存
            setIsSaved(true);
        } catch (error) {
            console.error('儲存圖片失敗:', error);

            // 備用方案：使用 Canvas API 自動下載
            try {
                const dataUrl = await toPng(modalRef.current, {
                    backgroundColor: '#fff9e6',
                    pixelRatio: 2,
                });

                // 開啟新視窗顯示圖片（Safari 備用方案）
                const newWindow = window.open();
                if (newWindow) {
                    newWindow.document.write(`
                        <html>
                            <head><title>${deityName}靈籤 - ${result.title}</title></head>
                            <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#1a0f0f;">
                                <img src="${dataUrl}" style="max-width:100%;height:auto;" />
                            </body>
                        </html>
                    `);
                    newWindow.document.close();
                }
                setIsSaved(true);
            } catch (fallbackError) {
                console.error('備用方案也失敗:', fallbackError);
                alert('儲存圖片失敗，請長按圖片手動儲存');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setIsSaved(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-md transition-opacity duration-300" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
            <div
                ref={modalRef}
                className="paper-texture w-[90%] max-w-md min-h-[600px] p-8 relative animate-modal flex flex-col items-center border-l-4 border-r-4 border-double border-red-900/30"
            >

                {/* Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-900/50 m-2"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-900/50 m-2"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-900/50 m-2"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-900/50 m-2"></div>

                {/* Header */}
                <div className="text-center border-b border-red-900/20 w-full pb-4 mb-2">
                    <div className="text-red-900/60 font-calligraphy text-2xl mb-2">{deityName}靈籤</div>
                    <h2 className="text-4xl text-black font-bold font-serif mb-3 tracking-widest">{result.title}</h2>
                    <div className="flex justify-center">
                        <span className={getLevelClass(result.level)}>{result.level}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow w-full flex flex-col items-center gap-6 py-4 overflow-y-auto">
                    {/* Poem (Vertical) */}
                    <div className="w-full flex justify-center pt-2">
                        <div className="vertical-text text-2xl font-bold font-serif text-black leading-loose h-auto min-h-[200px] border-l-2 border-red-900/20 pl-6 whitespace-pre-line">
                            {result.poem}
                        </div>
                    </div>

                    {/* Explanation (Horizontal) */}
                    <div className="w-full px-4 flex flex-col items-center">
                        <div className="bg-red-900/10 text-red-900 px-4 py-1 text-sm mb-3 rounded font-serif font-bold tracking-widest">
                            聖意詳解
                        </div>
                        <div className="text-lg text-gray-800 font-serif leading-loose whitespace-pre-line text-justify w-full">
                            {result.explain}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-red-900/20 w-full text-center">
                    {!isSaved ? (
                        <button
                            onClick={handleSaveImage}
                            disabled={isSaving}
                            className={`text-red-900 border border-red-900 px-6 py-2 rounded hover:bg-red-900 hover:text-white transition font-serif tracking-widest ${isSaving ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            {isSaving ? '儲存中...' : '收下籤詩'}
                        </button>
                    ) : (
                        <div className="text-gray-500 text-sm tracking-wider font-serif">
                            CREATED BY VIBE QUIRK LABS
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
