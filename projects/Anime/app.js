let swap_btns = document.querySelectorAll('.page_btn')
let page = 1
let url = ``
let text_anime = document.querySelector('.title')

const url2 = new URL(window.location.href);
url2.searchParams.set('page', 1);
history.pushState({}, '', url2);


const hasVerticalScroll = window.innerHeight > document.body.scrollHeight;
if(hasVerticalScroll){
	document.querySelector('main').style = `height:${window.innerHeight}px;`
}

async function fetchAnime(next_page) {
	if(next_page !== undefined){page=next_page}
	let tempData = await fetch(`https://api.jikan.moe/v4/anime?page=${page}`)
	let data = await tempData.json()
	renderCards(data)
}

function renderCards(info){

	let cards = document.querySelector('.cards')

	info.data.forEach(element => {
		let card = document.createElement('div')
		card.classList.add('card_anime')

		let img = createImg(element.images.jpg.image_url)
		img.setAttribute('width', 300)
		img.setAttribute('height', 400)

		let title = createP(element.title)
		title.classList.add('text_card')
		title.addEventListener('click', () => {
			localStorage.setItem('isLoadInfoAnime', true)
			renderInfoAnime(element)
		})

		let count_episodes = createP(
			`${element.episodes === null ? 'wanted' : element.episodes} ${+element.episodes > 1 ? 'episodes' : 'episode'}`)
		count_episodes.classList.add('count_episodes')

			card.append(img)
			card.append(title)
			card.append(count_episodes)
			cards.append(card)

			card.animate([
				{ opacity: 0, transform: 'scale(0)' },
				{ opacity: 1, transform: 'scale(1)' }
			], {
				duration: 1000,
				easing: 'ease-out',
				fill: 'forwards'
			});
	});
	
}

function renderInfoAnime(info){

	const url2 = new URL(window.location.href);
	url2.searchParams.set('anime', info.title);
	url2.searchParams.set('id', info.mal_id)

	window.history.pushState({}, '', url2);

	let content = document.querySelector('.content')
	let info_card_div = document.querySelector('.info_card')

	info_card_div.classList.remove('hidden')
	let left_div = document.createElement('div')
	left_div.classList.add('left_part_card')

	let right_div = document.createElement('div')
	right_div.classList.add('right_part_card')

	// LEFT PART
	let img = createImg(info.images.jpg.image_url)

	let left_title = createP(`Title: ${info.title}`)
	left_title.classList.add('left_title_card_info')

	let left_aired = createP(`Date of release: ${info.aired.from.split('-')[0]}`)
	left_aired.classList.add('left_date_release')

	let episodes = createP(`episodes: ${info.episodes === null ? 'wanted' : info.episodes}`)
	episodes.classList.add('left_episodes')
	// RIGHT PART
	let btn_return = document.createElement('button')

	btn_return.classList.add('page_btn_return')
	btn_return.style = 'float:right; margin-right:10px; width:60px;'
	btn_return.textContent = 'Return'

	btn_return.addEventListener('click', () => {
		const url3 = new URL(window.location.href);
		url3.searchParams.delete('id')
		url3.searchParams.delete('anime')
		
		window.history.pushState({}, '', url3);

		localStorage.setItem('isLoadInfoAnime', false)
		fetchAnime(localStorage.getItem('page'));
		content.innerHTML = `` 
	})

	let description = createP(info.synopsis)

	let trailer = document.createElement('a')
	trailer.textContent = `Trailer:${info.trailer.url === null || undefined ? 'Has no trailer' : info.trailer.url}`
	trailer.classList.add('a_right_part_crad_info')


	trailer.addEventListener('click', () => {
		let video = document.querySelector('.player')
		let player = document.querySelector('.trailer')
		if(info.trailer.embed_url === null){
			return
		}
		if(video === null){
			video = document.createElement('iframe');

			video.src = info.trailer.embed_url;
			video.frameBorder = '0'; 
			video.width = '560';
			video.height = '315';
			video.setAttribute('allowfullscreen', '');
			video.referrerpolicy = 'strict-origin-when-cross-origin'
			video.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin'
			player.append(video)
		}
		video.src = info.trailer.embed_url
		player.classList.remove('hidden')
		
		info_card_div.style = 'width:700px'

		let btn_return = document.createElement('button')
		btn_return.classList.add('page_btn_return')
		btn_return.style = 'float:right; width:60px; margin-left:45px;'
		btn_return.textContent = 'Return'
		
		info_card_div.animate([
			{ opacity: 0, transform: 'scale(0)' },
			{ opacity: 1, transform: 'scale(1)' }
		], {
			duration: 1000,
			easing: 'ease-out',
			fill: 'forwards'
		});

		btn_return.addEventListener('click', () => {
			player.classList.add('hidden')
			info_card_div.style = 'width: 1000px;'
			renderInfoAnime(info)
			video.remove()
			btn_return.remove()
		})
		left_div.innerHTML = ``
		right_div.innerHTML = ``
		player.append(btn_return)
	})

	let watch = document.createElement('a')
	watch.classList.add('a_watch_anime')
	watch.textContent = `Watch here: ${info.url}`
	watch.href = `${info.url}`
	watch.target = '_blank'

	
	let genres_array = []
	info.genres.forEach((genre) => {
		genres_array.push(genre.name)
		return genres_array
	})
	let genres_str = createP(`Genres:${genres_array}`)

	document.querySelector('.cards').innerHTML = ``

	left_div.append(img,left_title,left_aired,episodes)
	right_div.append(btn_return,description, trailer, watch, genres_str)
	if(content === null){
		info_card_div.append(left_div, right_div)
	} else {
		content.append(left_div,right_div)
		info_card_div.append(content)
	}
	info_card_div.animate([
		{ opacity: 0, transform: 'scale(0)' },
		{ opacity: 1, transform: 'scale(1)' }
	], {
		duration: 1000,
		easing: 'ease-out',
		fill: 'forwards'
	});
	
}

function createImg(url){
	let img = document.createElement('img')
	img.setAttribute('src', url)
	return img
}

function createP(text){
	const p = document.createElement('p')
	p.innerText = text
	return p
}


const urlParams = new URLSearchParams(window.location.search);
const page_param = urlParams.get('page');


swap_btns.forEach((btn) => {
	
	btn.addEventListener('click', () => {
		page = +btn.textContent
		localStorage.setItem('page', page)
		
		document.querySelector('.cards').innerHTML = ``

		const url2 = new URL(window.location.href);
		url2.searchParams.set('page', +btn.textContent);
		window.location.href = url2.toString();

		fetchAnime(page)
	})
	
})
let btn_more = document.querySelector('.page_btn_more')
let btn_return = document.querySelector('.page_btn_return')
let page_for_return = localStorage.getItem('page')

if(+document.querySelector('.page_btn').textContent <= 10){
	btn_return.setAttribute('disabled', '')
} else {
	btn_return.removeAttribute('disabled')
}

btn_more.addEventListener('click', () => {
	page_for_return = page_for_return + 10
	localStorage.setItem('page_for_return', page_for_return)
	swap_btns.forEach((el) => {
		if(+localStorage.getItem('page_for_return') >= 10){
			btn_return.removeAttribute('disabled')
		}
		el.textContent = +el.textContent + 10
	
	})
})

btn_return.addEventListener('click', () => {
	page_for_return = page_for_return - 10
	localStorage.setItem('page_for_return', page_for_return)
	swap_btns.forEach((el) => {
		if(+localStorage.getItem('page_for_return') < 10){
			btn_return.setAttribute('disabled', '')
		}
		el.textContent = +el.textContent - 10})
})

window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get('page') || '1'; 
  
  localStorage.setItem('page', pageParam);
  
  if (pageParam.length === 2 && parseInt(pageParam) > 10) {
    const firstDigit = pageParam[0]; 
    const pagePlusValue = parseInt(firstDigit) * 10; 
    localStorage.setItem('page_plus', pagePlusValue.toString());
  }
  if (pageParam.length === 3 && parseInt(pageParam) > 99) {
		const text = pageParam[0] + pageParam[1]; 
    const pagePlusValue = parseInt(text) * 10; 
    localStorage.setItem('page_plus', pagePlusValue.toString());
  }
  if (pageParam.length === 4 && parseInt(pageParam) > 999) {
		const text = pageParam[0] + pageParam[1] + pageParam[2]; 
    const pagePlusValue = parseInt(text) * 10; 
    localStorage.setItem('page_plus', pagePlusValue.toString());
  }

	const animeParam = urlParams.get('anime') || undefined
	
	if(animeParam !== undefined && localStorage.getItem('isLoadInfoAnime') !== 'false'){
		localStorage.setItem('isLoadInfoAnime', true)

		renderAnimeInfoLoad(true)
	} else {
		fetchAnime(pageParam); 
	}
  changeNumber();
  
});

function renderAnimeInfoLoad(isLoad){
	if(isLoad === true){
  	const idParam = urlParams.get('id'); 
		fetchAnimeById(idParam)
	}
}
document.addEventListener('DOMContentLoaded', () => {
	let number_page = localStorage.getItem('page')

	if(number_page.length === 1){
		localStorage.setItem('page_plus', undefined)
	}
	if(+number_page <= 10){
		btn_return.setAttribute('disabled', '')
	} else {
		btn_return.removeAttribute('disabled')
	}
	text_anime.addEventListener('click', () => {
		localStorage.setItem('page', 1);
		const urlParams = new URL(window.location.href);
		urlParams.searchParams.set('page', 1); 
		urlParams.searchParams.delete('anime')
		urlParams.searchParams.delete('id')
		window.location.href = urlParams.toString();

	})
})

function fetchAnimeById(id){
	fetch(`https://api.jikan.moe/v4/anime/${id}`).then((data) => {
		return data.json()
	}).then((info) => {
		console.log(info.data)
		renderInfoAnime(info.data)
		
	})
}

function changeNumber(){
	swap_btns.forEach((btn) => {
		if(localStorage.getItem('page_plus') !== 'undefined'){
			btn.textContent = +btn.textContent + +localStorage.getItem('page_plus')
		}
	})
}

