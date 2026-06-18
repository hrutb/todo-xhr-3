let base_url = `https://jsonplaceholder.typicode.com`; 
let todo_url = `${base_url}/todos/` 

const titleControl= document.getElementById('title');
const completedControl= document.getElementById('completed');
const todoForm= document.getElementById('todoForm')
const todoContainer= document.getElementById('todoContainer');
const spinner= document.getElementById('spinner');

const addTodo = document.getElementById('addTodo');
const updateTodo = document.getElementById('updateTodo');


let todoArr=[];






function snackbar(msg,icon){ 
      swal.fire({ 
             title:msg,
             icon:icon,
             timer:3000
          })
      }


function fetchTodo(){ 
       
 spinner.classList.remove('spinner');
  let xhr =new XMLHttpRequest(); 
      xhr.open('GET', todo_url); 
      xhr.send(null); 
      
     xhr.onload= function(){ 
        if(xhr.status>=200 && xhr.status<=299){ 
             
          todoArr= JSON.parse(xhr.response);
            createCards(todoArr.reverse());
          $(function () {
              $('[data-toggle="tooltip"]').tooltip()
            })
             spinner.classList.add('spinner');
          
          }else{ 
            spinner.classList.add('spinner');
             
             snackbar('failed to call Api ', 'error')   
            }
      
      } 
 
      xhr.onerror = function (){ 
          snackbar('Failed to call Api ', 'error')   
      }

} 



fetchTodo();

function createCards(arr){ 
    let res = ' '; 

    arr.forEach(ele=>{ 
         res +=`<div class="col-md-4 mb-4" id=${ele.id}>
                        <div class="card">
                            <div class="card-header bg-grey"  data-toggle="tooltip" data-placement="top" title="${ele.title}">
                                <h4>${ele.title}</h4>
                            </div>
                            <div class="card-body">
                                <h4>Status: <span class="badge ${ele.completed ? 'bg-success':'bg-danger'}">${ele.completed? "Completed":"Pending"}</span></h4>
                            </div>
                            <div class="card-footer d-flex justify-content-between ">
                                <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                                <i onclick="onRemove(this)"  class="fa-solid fa-trash-can fa-2x text-danger"></i>

                            </div>
                        </div>
                    </div>`
      
       todoContainer.innerHTML =res ;
    })
} 


function onSubmit(eve){ 
     eve.preventDefault(); 

     let newTodo= { 
          title:titleControl.value ,
          completed:completedControl.value 

        }
          spinner.classList.remove('d-none');
      let xhr= new XMLHttpRequest()  ; 
          xhr.open('GET',todo_url);
          xhr.setRequestHeader('content-type', 'application/json'); 
          xhr.setRequestHeader("Auth", 'Get token from'); 

          xhr.send(JSON.stringify(newTodo));
          
          xhr.onload = function(){
            
           if(xhr.status>=200 && xhr.status<=299) { 
               let res =JSON.parse(xhr.response);
            let div =document.createElement('div');
                div.id =res.id; 
                div.innerHTML= `<div class="card ">
                            <div class="card-header "  data-toggle="tooltip" data-placement="top" title="${newTodo.title}">
                                <h4>${newTodo.title}</h4>
                            </div>
                            <div class="card-body">
                               <h4>Status: <span class="badge ${newTodo.completed ? 'bg-success':'bg-danger'}">${newTodo.completed? "Completed":"Pending"}</span></h4>
                            </div>
                           
                            <div class="card-footer d-flex justify-content-between ">
                                <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                                <i onclick="onRemove(this)"  class="fa-solid fa-trash-can fa-2x text-danger"></i>
                            </div>
                        </div>`;

              todoContainer.prepend(div);
              spinner.classList.add('d-none');
              
            }else{ 
              spinner.classList.add('d-none');
              snackbar("Failed to submit todo",'error');
            }
          
          
          
          }
      
} 

function onRemove(ele){
   let removeId   = ele.closest('.col-md-4').id
   let removeUrl  =`${base_url}/todos/${removeId}`;
   

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
      
        if (result.isConfirmed) {
      
          let xhr = new XMLHttpRequest(); 
              xhr.open('DELETE',removeUrl); 
              xhr.send(null);
      
              xhr.onload = function (){ 
              
              if(xhr.status>=200 && xhr.status<=299){ 
                  ele.closest('.col-md-4').remove();
                  snackbar('Todo deleted successfully...!','success');
                 }
             } 
           }
        });
 }




function onEdit(ele){
   let editId= ele.closest('.col-md-4').id;
       localStorage.setItem('EditId',editId);
   let editUrl = `${base_url}/todos/${editId}`;

       spinner.classList.remove('d-none');
 
   let xhr= new XMLHttpRequest(); 
    
       xhr.open('GET',editUrl);
       xhr.send(null);
   
       
       xhr.onload = function(){ 
         
         if(xhr.status>=200 && xhr.status<=299) { 
            let editObj= JSON.parse(xhr.response); 
                 console.log(editObj);
                 
               titleControl.value = editObj.title; 

               if(editObj.completed){

                 completedControl.value  = "Yes"; 
               }else{ 
                 completedControl.value  = "No"; 
                 
               }

               addTodo.classList.add('d-none');
               updateTodo.classList.remove('d-none');
               window.scrollTo({top:0 , behavior:'smooth'});
            
               spinner.classList.add('d-none') 
         
         }else{
               spinner.classList.add('d-none') 
               snackbar('Failed to patch todo on form...','error')
              } 
           } 
      }



  function onUpdate(){

       let updateId= localStorage.getItem('EditId');
       let updateUrl =`${base_url}/todos/${updateId}`;

       let updateObj = { 
           title:titleControl.value ,
           completed:completedControl.value
         }

     let xhr =new XMLHttpRequest();
         xhr.open('PATCH',updateUrl); 
         xhr.send(JSON.stringify(updateObj));

         xhr.onload= function(){ 
           
         if(xhr.status>=200 && xhr.status<=299){
              let col =  document.getElementById(updateId);
                  col.innerHTML= `<div class="card ">
                                      <div class="card-header "  data-toggle="tooltip" data-placement="top" title="${updateObj.title}">
                                          <h4>${updateObj.title}</h4>
                                      </div>
                                      <div class="card-body">
                                        <h4>Status: <span class="badge ${updateObj.completed ? 'bg-success':'bg-danger'}">${updateObj.completed? "Completed":"Pending"}</span></h4>
                                      </div>
                                    
                                      <div class="card-footer d-flex justify-content-between ">
                                          <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                                          <i onclick="onRemove(this)"  class="fa-solid fa-trash-can fa-2x text-danger"></i>
                                      </div>
                                  </div>`

                  addTodo.classList.remove('d-none');
                  updateTodo.classList.add('d-none');
                  todoForm.reset();
                  spinner.classList.add('d-none'); 
             

                col.scrollIntoView({behavior:'smooth', block:'center'})

                  snackbar('Todo updated successfully...!','success')

                }else{ 
                  spinner.classList.add('d-none'); 
             
                  snackbar('Failed to update todo...!','error')
              }
         }


    
  }



todoForm.addEventListener('submit', onSubmit);
updateTodo.addEventListener('click', onUpdate);











