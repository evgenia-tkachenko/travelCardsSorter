/*
Входные данные должны представлять из себя массив объектов с двумя обязательными свойствами:
start.city и finish.city - места отправления и прибытия соответственно.
Данные о способе передвижения заносятся в свойство transport. Для лучшего результата
рекомендуется использовать следующие свойства:
 - transport.type (тип транспорта);
 - transport.number (номер рейса/поезда и т.п);
 - transport.other (иная информация и пометки).
 Другие свойства можно использовать в свободной форме.

 Пример:
 {
	start: {
		city: "Minsk International Airport",
		country: "BY"
	},
	finish: {
		city: "Domodedovo Airport",
		country: "RU"
	},
	transport: {
		type: "flight",
		number: "SK455",
		gate: "45B",
		seat: "3A",
		other: "Baggage drop at ticket counter 344"
	}
}

Выходные данные представляют из себя строку, описывающую составленный маршрут.
*/


function TravelSort(data) {
	this.cards = data;
	this.cardsCopy = {};
	this.destinations = [];
	this.route = [];
	this.error = false;

	if (!cards || cards.length === 0 || !Array.isArray(cards)) {
		console.error("No cards!");
		this.error = true;
	}
	else {
		this.getCards();
		this.sortCards();
	}
}

// Импорт карточек

TravelSort.prototype.getCards = function(cards) {
	var ctx = this;

	ctx.cards.forEach(function(item, index, arr) {
		if (!item.start.city || !item.finish.city || 
			item.start.city === "" || item.finish.city === "" || 
			typeof item.start.city !== "string" || typeof item.finish.city !== "string") {

			console.error("No origin or no destination found!");
			ctx.error = true;
			ctx.createDescription();
		}

		else {
			ctx.cardsCopy[item.start.city] = item;
			ctx.destinations.push(item.finish.city);
		}
	});
}

// Поиск первой карточки

TravelSort.prototype.findFirstCard = function() {
	var ctx = this;
	
	ctx.cards.forEach(function(item, index, arr) {
		if (ctx.destinations.indexOf(item.start.city) === -1) {
			ctx.route.push(item);
		}
	})
}

// Сортировка с использованием ассоциативного массива

TravelSort.prototype.sortCards = function() {
	var ctx = this;

	ctx.findFirstCard();

	for(var i = 0; i < ctx.cards.length - 1; i++) {
		var nextCard = ctx.cardsCopy[ctx.route[i].finish.city];
		ctx.route.push(nextCard);
	}
}

// Формирование словесного описания маршрута

TravelSort.prototype.createDescription = function() {
	var ctx = this;

	if(this.error) {
		descripiton = "Cannot build a route. Please check initial data.";
	}
	else {

		var descripiton = "";

		ctx.route.forEach(function(item, index, arr) {

			descripiton += (index + 1) + ") ";

			if(!item.transport) {
				descripiton += "Walk from " + item.start.city + " to " + item.finish.city;
			}
			else {
				item.transport.type ? (descripiton += "Take " + item.transport.type) : (descripiton += "Get");
				item.transport.number ? (descripiton += " " + item.transport.number) : descripiton += "";
				descripiton += " from " + item.start.city + " to " + item.finish.city;

				for(var key in item.transport) {
					switch(key) {
						case "type": descripiton += ""; break;
						case "number": descripiton += ""; break;
						case "other": descripiton += ". " + item.transport[key]; break;
						default: descripiton += ". " + key[0].toUpperCase() + key.substr(1) + " " + item.transport[key];
					}
				}

				if(!item.transport.seat) descripiton += ". No seat assignment";
			}

			descripiton += ".\n\n"; 
		})

	}

	return descripiton;
}