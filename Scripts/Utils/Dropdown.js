export const Dropdown = () => {
    const iconeDown = document.querySelector('.fa-angle-down');
    
    buttonDropdown.addEventListener('click', () => {
        iconeDown.classList.toggle('fa-rotate-180');
    });
};