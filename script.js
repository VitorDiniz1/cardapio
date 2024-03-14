const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsModal = document.getElementById("items-cart")
const cartTotal = document.getElementById("cart-total")
const closeModalBtn = document.getElementById("close-modal-btn")
const checkOutBtn = document.getElementById("checkout-btn")
const cartCount = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = []

//abrir o modal do carrinho
cartBtn.addEventListener('click',function(){
    cartModal.style.display = "flex"
    updateCartModal()
})
//abrir o modal do carrinho

//fechar o modal clicando fora dele
cartModal.addEventListener('click',function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})
//fechar o modal clicando fora dele

//fechar o modal clicando no botao fechar
closeModalBtn.addEventListener('click',function(){
    cartModal.style.display = "none"
})
//fechar o modal clicando no botao fechar

menu.addEventListener('click',function(event){

    let parentBtn = event.target.closest(".add-to-cart-btn")

    if(parentBtn){
        const name = parentBtn.getAttribute('data-name')
        const price = parseFloat(parentBtn.getAttribute('data-price'))
        addToCart(name,price)
    }
})

//funcao para adicionar no carrinho

function addToCart(name,price){
    const existingItem = cart.find(item=>item.name === name)

    if(existingItem){
        existingItem.qtd += 1

    }else{
        cart.push({
            name,
            price,
            qtd: 1,
        })
    }
    updateCartModal()
}

//funcao para adicionar no carrinho

//atualizar o carrinho
function updateCartModal(){
    cartItemsModal.innerHTML= ""
    let total = 0

    cart.forEach(item =>{
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between","mb-4" ,"flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.qtd}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
            </div>
        `

        total += item.price * item.qtd
        cartItemsModal.appendChild(cartItemElement)
        
    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style:"currency",
        currency:"BRL"
    })

    cartCount.innerHTML = cart.length;


}
//atualizar o carrinho

//Funcao para remover o item do carrinho




//Funcao para remover o item do carrinho

cartItemsModal.addEventListener('click',function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index!== -1){
        const item = cart[index]

        if(item.qtd > 1){
            item.qtd -= 1
            updateCartModal()
            return
        }

        cart.splice(index,1)
        updateCartModal()
    }
}

addressInput.addEventListener('input',function(){
    let inputValue = event.target.value

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})
//finalizar pedido
checkOutBtn.addEventListener('click',function(){
/*
    const isOpen = checkRestaurantOpen()
    if(!isOpen){
        alert("O RESTAURANTE ESTÁ FECHADO NO MOMENTO")
        return
    }
*/

    if(cart.length === 0) return
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }

    //enviar o pedido para wpp

    const cartItems = cart.map((item)=>{
        return(
            `${item.name} Quantidade: (${item.qtd}) Preço: R$(${item.price}) |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = ""

    window.open(`https://wa.me/${phone}?text=${message} Endereço:${addressInput.value}`,"_blank")

    cart = []
    updateCartModal()

})
//finalizar pedido


//verificar e mapear o horario
function checkRestaurantOpen(){
    const data = new Date()
    const hora = data.getHours()
    return hora >=18 && hora < 22
}
//verificar e mapear o horario

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500") 
}