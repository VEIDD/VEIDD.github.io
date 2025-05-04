let btns = document.querySelectorAll('.btn')
let btn_go = document.querySelector('.btn_go')
let input = document.querySelector('.input')
let title_block = document.querySelector('.title_block')
let title = 'Caps'
let rep = document.querySelector('.rep')

let btn_copy = document.querySelector('.btn_copy')
btn_go.addEventListener('click', () => {
	let result = ''
	switch (title){
		case 'Caps':
			result = input.value.toUpperCase()
			input.value = result
			break
		case 'Anti caps':
			result = input.value.toLowerCase()
			input.value = result
			break
		case 'Replace':
			let a = document.querySelector('.a')
			let b = document.querySelector('.b')
			result = input.value.replaceAll(a.value, b.value)
			input.value = result
		case 'Trim':
			
	}
})

btn_copy.addEventListener('click', () => {
	navigator.clipboard.writeText(input.value)
	btn_copy.textContent = 'Copied'
	setTimeout(() => {
		btn_copy.textContent = 'Copy'
	}, 2000)
})

btns.forEach((el) => {
	el.addEventListener('click', () => {
		btns.forEach(btn => btn.classList.remove('active'));
		el.classList.add('active')
		title = el.textContent
		switch (title){
			case 'Caps':
				btn_go.classList.remove('hidden')
				title_block.textContent = 'Make your text big'
				document.querySelector('.rep').innerHTML = ``
				break
			case 'Anti caps':
				btn_go.classList.remove('hidden')
				title_block.textContent = 'Make your text small'
				document.querySelector('.rep').innerHTML = ``
				break
			case 'Replace':
				btn_go.classList.remove('hidden')
				title_block.textContent = 'Replace a letter with another'
				rep.innerHTML = `
					<input type="text" class='a' placeholder='First litter'>
					<input type="text" class='b' placeholder='Second litter'><br>`
					rep.classList.remove('rep_trim')
				break
			case 'Trim':
				title_block.textContent = 'Delete space from your text'
				rep.innerHTML = `
					<button class="btn_trim">Start</button>
					<button class="btn_trim">End</button>
					<button class="btn_trim">All</button>
				`
				rep.classList.add('rep_trim')
				btn_go.classList.add('hidden')
				let btns_trim = document.querySelectorAll('.btn_trim')
				btns_trim.forEach((btn) => {
					let text_btn = btn.textContent
					btn.addEventListener('click', () => {
						switch (text_btn){
							case 'Start':
								input.value = input.value.trimLeft()
							case 'End':
								input.value = input.value.trimRight()
							case 'All':
								input.value = input.value.trim()
						}
				})
			})
				break
		}	
	})
})


