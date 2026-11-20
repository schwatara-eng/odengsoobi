document.querySelectorAll('.play').forEach((button)=>{button.addEventListener('click',()=>{button.textContent=button.textContent==='▶'?'Ⅱ':'▶';});});
const modal=document.getElementById('artModal'),modalImg=modal?.querySelector('.modal-image'),caption=modal?.querySelector('.modal-caption');
document.querySelectorAll('.desk-photo').forEach((photo) => {
  photo.addEventListener('click', () => {
    modalImg.src = photo.dataset.full;
    modalImg.alt = photo.querySelector('img').alt;
    caption.textContent = photo.querySelector('.desk-caption').textContent;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});
function closeArtModal(){if(!modal)return;modal.classList.remove('open');modal.setAttribute('aria-hidden','true');modalImg.src='';document.body.style.overflow=''}
modal?.querySelector('.modal-close').addEventListener('click',closeArtModal);modal?.addEventListener('click',(e)=>{if(e.target===modal)closeArtModal()});document.addEventListener('keydown',(e)=>{if(e.key==='Escape')closeArtModal()});
/* Remove artwork elements whose local image file does not exist. */
document.querySelectorAll('.desk-photo img').forEach((img)=>{
  const removeMissing=()=>img.closest('.desk-photo')?.remove();
  if(img.complete && img.naturalWidth===0) removeMissing();
  img.addEventListener('error',removeMissing,{once:true});
});

const desk = document.querySelector('.desk');
const deskPhotos = [...document.querySelectorAll('.desk-photo')];
const mobileDesk = window.matchMedia('(max-width: 760px)');

function positionDeskPhotos() {
  const bounds = desk.getBoundingClientRect();
  const gap = parseFloat(getComputedStyle(desk).columnGap);
  const titleRight = bounds.left + (bounds.width - gap / 2) / 3;
  const titleBottom = bounds.top + bounds.height / 2;
  const inset = 4;

  const offsets = deskPhotos.map((photo, index) => {
    if (!photo.isConnected) return null;

    const width = photo.offsetWidth;
    const height = photo.offsetHeight;
    const angle = Math.abs(parseFloat(getComputedStyle(photo).getPropertyValue('--tilt'))) * Math.PI / 180;
    const halfWidth = Math.max(width, width * Math.cos(angle) + height * Math.sin(angle)) / 2;
    const halfHeight = Math.max(height, height * Math.cos(angle) + width * Math.sin(angle)) / 2;
    // Inline transforms do not affect the element's layout coordinates.
    const centerX = bounds.left + photo.offsetLeft + width / 2;
    const centerY = bounds.top + photo.offsetTop + height / 2;
    const desiredX = centerX + Math.sin(index * 2.39 + .8) * Math.min(42, width * .23);
    const desiredY = centerY + Math.sin(index * 1.71 + 1.4) * Math.min(38, height * .25);

    let left = bounds.left;
    let top = bounds.top;
    if (!mobileDesk.matches) {
      if (centerX < titleRight) {
        top = titleBottom;
      } else if (desiredY - halfHeight < titleBottom) {
        left = titleRight;
      }
    }

    const x = Math.min(bounds.right - halfWidth - inset, Math.max(left + halfWidth + inset, desiredX));
    const y = Math.min(bounds.bottom - halfHeight - inset, Math.max(top + halfHeight + inset, desiredY));
    return { photo, x: x - centerX, y: y - centerY };
  });

  offsets.forEach((offset) => {
    if (!offset) return;
    offset.photo.style.setProperty('--photo-x', `${offset.x}px`);
    offset.photo.style.setProperty('--photo-y', `${offset.y}px`);
  });
}

if (desk) {
  const deskObserver = new ResizeObserver(positionDeskPhotos);
  deskObserver.observe(desk);
  deskPhotos.forEach((photo) => deskObserver.observe(photo));
  mobileDesk.addEventListener('change', positionDeskPhotos);
}
