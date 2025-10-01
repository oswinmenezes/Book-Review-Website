function showSideBar(){
    const sideBar=document.querySelector("#sidebar");
    sideBar.style.display="flex";
}
function closeSideBar(){
    const sideBar=document.querySelector("#sidebar");
    sideBar.style.display="none";
}
document.querySelector("#deleteBtn").addEventListener("click",()=>{
     alert("Deleted Summary Successfully")
})