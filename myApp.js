var app = angular.module('myApp', []);

app.filter("offset", function() {
	return function(input, start) {
		start = parseInt(start, 10);
		return input.slice(start);
	};
});



app.controller("myCtrl", function($scope, $http) {
	/*------------------------
	Home
	------------------------*/
	//Initiate Page Value
	$scope.page = "home";
	$scope.dataLoaded = false;

	//Get Products from file
	$http.get("product-data.json")
		.then(function(response) {
		$scope.products = response.data;

		getProductLists();
	});

	function getProductLists() {
		//Get filtered Products list for products page
		$scope.filteredProducts = $scope.products;

		//Get list of featured products
		$scope.featuredProducts = [];
		for(var i = 0; i < $scope.products.length; i++) {
			if($scope.products[i].featured==true) {
				$scope.featuredProducts.push($scope.products[i]);
			}
		}

		//Get list of popular products
		$scope.popularProducts = $scope.products;
		//Sort List
		$scope.popularProducts.sort(function(a, b){
			var x = a.amountSold;
			var y = b.amountSold;
			if (x < y) {return -1;}
			if (x > y) {return 1;}
			return 0;
		});
		//Trim list to the desired amount
		$scope.popularProducts = $scope.popularProducts.slice(0, 4);

		$scope.dataLoaded=true;
	}


	/*------------------------
	Search
	------------------------*/
	$scope.productsPerPage = 8;	//Maximum items per page
	$scope.currentPage = 0;		//Current page
	$scope.dataLoaded=false;	//Don't display table until after data has retrieved from server

	//Initiate Search Values
	$scope.searchTerm = "";
	$scope.searchCategory = "";

	//Display the table items
	$scope.range = function() {
		var rangeSize = 5;
		var ret = [];
		var start = $scope.currentPage;
		if (start > $scope.pageCount() - rangeSize) {
			start = $scope.pageCount() - rangeSize + 1;
		}
		for (var i=start; i<start + rangeSize; i++) {
			ret.push(i);
		}
		return ret;
	};

	//Go to previous page
	$scope.prevPage = function() {
		if ($scope.currentPage > 0) {
			$scope.currentPage--;
		}
	};

	//Disable previous page
	$scope.prevPageDisabled = function() {
		return $scope.currentPage === 0 ? "disabled" : "";
			/*if ($scope.currentPage === 0)
			{
				return true;
			}
		return false;*/
	};

	//go to next page
	$scope.nextPage = function() {
		if ($scope.currentPage < $scope.pageCount()) {
			$scope.currentPage++;
		}
	};

	//disable next page
	$scope.nextPageDisabled = function() {
		//return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
		if ($scope.currentPage === $scope.pageCount())
			{
				return true;
			}
		return false;
	};

	//Get page count
	$scope.pageCount = function() {
		return Math.ceil($scope.products.length / $scope.productsPerPage) - 1;
	};

	//Set the current page
	$scope.setPage = function(n) {
		$scope.currentPage = n;
	};


	//Refresh the List
	function refresh() {
		//Don't trigger untill after Data has loaded
		if($scope.dataLoaded)
		{
			//Empty Filtered List
			$scope.filteredProducts = []
			//Add Filtered products
			for(var i = 0; i < $scope.products.length; i++){

				if(($scope.products[i].name.includes($scope.searchTerm)
					|| $scope.products[i].desc.includes($scope.searchTerm))
				   && $scope.products[i].category.includes($scope.searchCategory)) {
					$scope.filteredProducts.push($scope.products[i]);
				}
			}

			//Update PageCount and Go back to first page
			$scope.pageCount();
			$scope.currentPage = 0;
		}
	}

	$scope.$watch('searchTerm', refresh, true);
	$scope.$watch('searchCategory', refresh, true);

	/*------------------------
	Cart
	------------------------*/
	$scope.cart = "";

	$scope.removeFromCart = function(cartItem) {
		//Search every item in cart
		for(var i = 0; i < $scope.cart.length; i++) {
			//Decrement the item when it's found
			if($scope.cart[i] == cartItem) {
				$scope.cart[i].count --;

				//TODO: Delete This
				//alert(cartItem.product.name + " count: " + cartItem.count);

				//If there are no more of this item in the cart, remove it
				if($scope.cart[i].count < 1){
					$scope.cart.splice($scope.cart.indexOf(cartItem),1);
					//TODO: Delete This
					//alert("Removing: " + cartItem.name);
					//If there are no more items in the cart, empty it
					if($scope.cart.length < 1)
					{
						$scope.cart="";
						//TODO: Delete This
						//alert("Emptying Cart");
					}
				}

				//TODO: Delete This
				//alert($scope.cart[i].product.name + " count: " + //$scope.cart[i].count);
				break;
			}
		}




		/*$scope.cart.splice($scope.cart.indexOf(product),1);
		if($scope.cart.length == 0)
		{
			$scope.cart="";
		}*/
	};

	/*------------------------
	Product
	------------------------*/
	$scope.currentProduct = "";
	$scope.showTip = false;

	$scope.getProduct = function(product) {
		$scope.currentProduct = product;
		$scope.page = "product";
	};

	$scope.addToCart = function() {
		//alert("Item added to cart.");
		$scope.showTip = true;
		//If the cart is empty, create a new cart and add item
		if($scope.cart=="")
		{
			$scope.cart=[];
			$scope.cart.push({
				product: $scope.currentProduct,
				count: 1
			});
			//TODO: Delete This
			//alert("Making New Cart");
		}
		//If the cart is empty, add item
		else {
			var notInArray = true;
			//If item is already in cart, increment its count
			for(var i = 0; i < $scope.cart.length; i++) {
				if($scope.cart[i].product == $scope.currentProduct) {
					$scope.cart[i].count ++;
					notInArray = false;
					break;
					//TODO: Delete This
					alert($scope.cart[i].product.name + " count: " + $scope.cart[i].count);
				}
			}
			//If item is not already in cart add it
			if(notInArray){
				$scope.cart.push({
					product: $scope.currentProduct,
					count: 1
				});
				//TODO: Delete This
				//alert("Adding Item");
			}
		}
		//TODO: Delete this
		//$scope.cart.push($scope.currentProduct);
	};

	//This method is employed to fix bug with ng-click("page='page_name'") not working in the cart page
	$scope.goTo = function(page){
		$scope.page=page;
		$scope.showTip = false;
	}

});
