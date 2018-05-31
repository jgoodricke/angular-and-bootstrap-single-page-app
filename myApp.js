var app = angular.module('myApp', []);

app.filter("offset", function() {
	return function(input, start) {
		start = parseInt(start, 10);
		return input.slice(start);
	};
});

app.controller("myCtrl", function($scope, $http) {
	$scope.unitsPerPage = 5;	//Maximum items per page
	$scope.currentPage = 0;		//Current page
	$scope.dataLoaded=false;	//Don't display table until after data has retrieved from server

	//Initiate Search Values
	$scope.searchCode = "";
	$scope.searchDesc = "";
	$scope.searchType = "";

	//Get Units from file
	$http.get("8.1P-json-file-data.json")
		.then(function(response) {
		$scope.units = response.data;
		$scope.filteredUnits = $scope.units;
		$scope.dataLoaded=true;
	});

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
		return Math.ceil($scope.units.length / $scope.unitsPerPage) - 1;
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
			$scope.filteredUnits = []
			//Add Filtered Units
			for(var i = 0; i < $scope.units.length; i++){
				if($scope.units[i].desc.includes($scope.searchDesc)
				   && $scope.units[i].code.includes($scope.searchCode)
				   && $scope.units[i].type.includes($scope.searchType)) {
					$scope.filteredUnits.push($scope.units[i]);
				}
			}

			//Update PageCount and Go back to first page
			$scope.pageCount();
			$scope.currentPage = 0;
		}
	}

	$scope.$watch('searchDesc', refresh, true);
	$scope.$watch('searchType', refresh, true);
	$scope.$watch('searchCode', refresh, true);
});
