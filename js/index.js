var infoWindow;
var map;
var markers= [];
function initMap(){
	var losAngeles = {
		lat: 34.063380,
		lng: -118.358080
	}
	map = new google.maps.Map(document.getElementById('map'),{
		center: losAngeles,
		zoom: 8
	});
	infoWindow = new google.maps.InfoWindow();
	searchStores();
	//showStoresMarkers();
	// setOnClickListener();
}

function setOnClickListener(){
	
	var storeElements = document.querySelectorAll('.store-container');
	storeElements.forEach(function(element, index){
		element.addEventListener('click',function(){
			google.maps.event.trigger(markers[index], 'click');
		});
	});
}

function clearLocations() {
	infoWindow.close();
	for (var i = 0; i < markers.length; i++) {
	  markers[i].setMap(null);
	}
	markers.length = 0;
}
function searchStores(){
	var foundStores=[];
	var zipCode = document.getElementById('search-input').value;
	if(zipCode){
		stores.forEach(function(store){
			var postal = store.address.postalCode.substring(0,5);
			if(postal == zipCode){
				//do something
				foundStores.push(store);
			}
		});
	}
	else{

		foundStores = stores;
	}
	clearLocations();
	displayStore(foundStores);
	showStoresMarkers(foundStores);
	setOnClickListener();
}

function displayStore(stores){
	var storesHtml = "";
	stores.forEach(function(store, index){
		
		var address = store.addressLines;
		var phone = store.phoneNumber;
		storesHtml +=`
			<div class="store-container">
				<dir class="store-container-background">
					<div class="store-info-container">
						<div class="store-address">
							<span>${address[0]}</span>
							<span> ${address[1]}</span>
						</div>
						<div class="store-phoneno">${phone}</div>
					</div>
					<div class="store-number-container">
						<div class="store-number">
							${index+1}
						</div>
					</div>
				</div>
			</div>
		`
	});
	document.querySelector('.stores-list').innerHTML = storesHtml;
}

function showStoresMarkers(stores) {
	var bounds = new google.maps.LatLngBounds();

	stores.forEach(function(store, index){
		var latlng = new google.maps.LatLng(
			store.coordinates.latitude,
			store.coordinates.longitude);
		var name = store.name;
		var address = store.addressLines[0];
		var phone = store.phoneNumber;
		var status = store.openStatusText;

		
		bounds.extend(latlng);
		createMarker(latlng, name,status,phone, address, index);
	});
	map.fitBounds(bounds);

}

function createMarker(latlng, name, status, phone, address, index) {
	// var html = "<b>" + name + "</b> <br/>" + address;
	var html = `
		<div class="store-info-window-container">
			<div class="store-into-name">
				${name}
			</div>
			<div class="store-info-status">
				${status} 
			</div>
			<div class="store-info-address">
				<div class="circle">
					<i class="fas fa-location-arrow"></i>
				</div>
				${address}
			</div>
			<div class="store-info-phoneno">
				<div class="circle">
					<i class="fas fa-phone-alt"></i>
				</div>
				${phone}
			</div>
		</div>
	`;
	var marker = new google.maps.Marker({
	  map: map,
	  position: latlng,
	  label: `${index+1}`,
	});
	google.maps.event.addListener(marker, 'click', function() {
	  infoWindow.setContent(html);
	  infoWindow.open(map, marker);
	});
	markers.push(marker);
  }
