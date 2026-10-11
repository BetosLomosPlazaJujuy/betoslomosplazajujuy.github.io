(() => {
  const holder = document.getElementById('qr-image');
  const download = document.getElementById('download-qr');
  if (!/^https?:$/.test(location.protocol)) {
    holder.textContent = 'El QR estará disponible al abrir la carta publicada.';
    return;
  }
  const target = new URL('./', location.href).href;
  const code = qrcode(0, 'M');
  code.addData(target);
  code.make();
  const img = new Image();
  img.alt = 'QR para abrir la carta digital';
  img.src = code.createDataURL(12, 48);
  holder.replaceChildren(img);
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    download.href = canvas.toDataURL('image/png');
    download.hidden = false;
  };
})();
