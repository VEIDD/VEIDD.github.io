let url_image = 'https://api.thecatapi.com/v1/images/search'
let url_facts = 'https://meowfacts.herokuapp.com/?lang=ukr'
let body = document.querySelector('body')
let div_content = document.querySelector('.fact_content')
let btn = document.querySelector('.btn')

async function fetchFacts(url) {
	let tempData = await fetch(url)
	let info = await tempData.json()
	let fact = 	createP(info.data[0])
	fact.classList.add('fact')
	div_content.append(fact)
}

async function fetchImage(url) {
	let tempData = await fetch(url)
	let data = await tempData.json()
	let img = createImg(data[0].url)
	div_content.append(img)
}

btn.addEventListener('click', () => {
	if (document.querySelector('.img_cat')){
		document.querySelector('.img_cat').remove() 
		document.querySelector('.fact').remove()
	}
	
	setTimeout(() => {
		fetchImage(url_image)
	}, 200)
	fetchFacts(url_facts)
	
})

function createImg(url){
	let img = document.createElement('img')
	img.setAttribute('src', url)
	img.classList.add('img_cat')
	return img
}

function createP(text){
	let fact = document.createElement('p')
	fact.textContent = text
	return fact
}