$(() => {
	let items = [];
	var cartTotal = 0;
	var itemQty;
	var itemId = 0;

	$.ajax({
		url: "items.js",
		success: (res) => {
			items = JSON.parse(res);
			$('#ajax-err').addClass('hidden');
			renderItems();
		},
		error: () => {
			$('#ajax-err').removeClass('hidden');
		},
		complete: () => {
			// ****/
		}
	})

	//*****************************************************************
	const renderItems = () => {
		for (let item of items) {
			const newItem = $('.item.hidden').clone();

			newItem
				.removeClass('hidden')
				.appendTo('#bottom')
				.children('img').attr('src', item.image)
			newItem
				.children('h3')
				.html(item.name)
			newItem
				.children('h4')
				.html(item.price)
			newItem
				.children('h5')
				.html(item.description)
			newItem
				.children('button')
				.html("Order")
		}

		//*****************************************************************
		//drag element
		$('.draggable').draggable({
			revert: "invalid",
			stack: ".draggable",
			handle: "img",
			helper: 'clone'
		});

		//*****************************************************************
		//drop element 
		$('.droppable').droppable({
			accept: ".draggable",
			drop: function (event, ui) {
				var droppable = $(this); //where user will drop item
				var draggable = ui.draggable; //selected and dragged item
				const newElement = draggable.clone().appendTo(droppable);
				//for case not use clone -- append also to original place

				//replace order with remove button
				$('.right .item button').html("Remove");

				//get price
				let price = draggable.find("h4").html();
				cartTotalCalc(price, "add");

				itemId++;

				//insert attribute with id
				newElement.attr('item_id', `${itemId}`);

				//add marks to structure
				addToSturcture(itemId, price);
			}
		});

		//*****************************************************************
		// onclick (order) button 
		$('body').on('click', '.left .item button', function () {
			const btn = $(this);
			const newElem = btn.parent('.item').clone();
			newElem.removeClass('hidden')
				.appendTo('.dropArea')

			newElem.children('button').html("Remove");

			let price = newElem.children('h4').html()
			cartTotalCalc(price, "add");

			itemId++;

			newElem.attr('item_id', `${itemId}`);

			addToSturcture(itemId, price);

		})//end of onclick func

		//*********************************************************************
		// onclick (remove) button 
		$('body').on('click', '.right .item button', function () {
			const btn = $(this);
			const removedElem = btn.parent('.item');

			let price = removedElem.children('h4').html();

			//get id from removed element
			var item_id = removedElem.attr('item_id');

			var targetElem, itemQty;

			// get qty 
			$('.marksArea .marks').each((i, el) => {
				var ID = $(el).attr('id');
				if (ID == item_id) {
					itemQty = parseInt($(el).children('p').html());
					targetElem = $(el);
				}
			})

			// get total price w/o taxes to be removed 
			var totalPrice = price * itemQty;
			cartTotalCalc(totalPrice, "remove");

			//remove item
			removedElem.hide();

			//remove marks
			targetElem.remove();

		})//end of on click func

		//**********************************************************************
		//onclick (+) $ (-) button 
		$('body').on('click', '.right .marksArea button', function () {
			const btn = $(this);
			const newElem = btn.parent('.marks');
			var qty = parseInt(newElem.children('p').html());
			var mark = btn.html();

			//get item price
			var price = btn.parent('.marks').attr('price');

			if (mark == '+') {
				qty = qty + 1;
				cartTotalCalc(price, "add");
			}
			if (mark == '-') {
				if (qty == 0) {
					qty = 0;
				} else {
					qty = qty - 1;
					cartTotalCalc(price, "remove");
				}
			}

			//set new qty
			newElem.children('p').html(qty);

		})//end of func

		//*********************************************************************
		// add & remove price 
		const cartTotalCalc = (price, state) => {
			wTax = parseInt(price * 1.14);

			if (state == "add") {
				cartTotal += wTax;
			}
			if (state == "remove") {
				cartTotal -= wTax;
			}
			$('.cart-total').html(
				!cartTotal ? '0' : cartTotal
			);
		}

		//********************************************************************
		//add to structure
		const addToSturcture = (itemID, Price) => {
			const markElem = $('.right').children('.marks').clone();
			markElem
				.removeClass('hidden')
				.appendTo('.marksArea')

			//add attributes (id) & (price)
			markElem.attr('id', `${itemID}`);
			markElem.attr('price', `${Price}`);
		}

		//********************************************************************
		//drag element from orders

		// $('.droppable').draggable({
		// 	revert: "invalid",
		// 	stack: ".draggable",
		// 	handle: "img",
		// 	stop: function () {
		// 		$('.droppable .item').hide();
		// 	}
		// });

	}//end of render func

})//end of jquery func


