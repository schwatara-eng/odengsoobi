document.querySelectorAll('.play').forEach((button)=>{button.addEventListener('click',()=>{button.textContent=button.textContent==='▶'?'Ⅱ':'▶';});});
const modal=document.getElementById('artModal'),modalImg=modal?.querySelector('.modal-image'),caption=modal?.querySelector('.modal-caption');
document.querySelectorAll('.desk-photo').forEach((photo)=>photo.addEventListener('click',()=>{modalImg.src=photo.dataset.full;modalImg.alt=photo.querySelector('img').alt;caption.textContent=photo.querySelector('img').alt;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}));
function closeArtModal(){if(!modal)return;modal.classList.remove('open');modal.setAttribute('aria-hidden','true');modalImg.src='';document.body.style.overflow=''}
modal?.querySelector('.modal-close').addEventListener('click',closeArtModal);modal?.addEventListener('click',(e)=>{if(e.target===modal)closeArtModal()});document.addEventListener('keydown',(e)=>{if(e.key==='Escape')closeArtModal()});
/* Remove artwork elements whose local image file does not exist. */
document.querySelectorAll('.desk-photo img').forEach((img)=>{
  const removeMissing=()=>img.closest('.desk-photo')?.remove();
  if(img.complete && img.naturalWidth===0) removeMissing();
  img.addEventListener('error',removeMissing,{once:true});
});