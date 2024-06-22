

const formularioo = document.querySelector('.form');

formularioo.addEventListener('submit',()=>{
  Swal.fire(
    {
      title: "Datos Enviados exitosamente ",
      text: "Te estaremos contactando pronto, gracias!",
      icon: "success",
      className: "my-swal-success"
    }
  )
  .then(res=>{
    fetch('/redireccionar')
    .then(res=> res.json())
    .then(res=>{
      if(res.message == true){
        window.location.href = '/';
      }
    })
  })  
});