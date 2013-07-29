/*!
* History JQuery Plug-in v0.0.5
* <website>
*
* Distributed in whole under the terms of the MIT
*
* Copyright 2010, Bryan Wood
*
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*
* Released under the MIT, BSD, and GPL Licenses.
* Date: October 10, 2010
*/

(function ($) {
	if (!$.ObjectCompare) {
		if (console) {
			console.log("jquery.History by Bryan Wood requires jquery.ObjectCompare by Bryan Wood");
		}
		return;
	}
    $.extend({
    	History: function(){
    		var Filters = []; //Master Filter collection
    		    		
			var Serialize = function () {
				///	<summary>
				///		1: Serialize() - Takes all the stored Filters and compiles them into an URL Key/Value pair string.
				///	</summary>
				///	<returns type="void" />
				
				var Result = ""; //used to store the return processed results
				
				//Process all filters in order
				for (var i = 0; i < Filters.length; i++) {
					//if the current filter is an object then
					if (typeof (Filters[i]) === "object") {
						//we need to process each objects property into a filter result
						//TODO: needs to be recursive into objects with objects
						for (Elm in Filters[i]) {
							Result += Elm + "=" + Filters[i][Elm] + "&";
						}
					} else {
						//we need to create a default Key for the solitary Value in this current filter
						Result += "value=" + Filters[i] + "&";
					}
				}
				
				//Remove the "&" from the end of the string
				if (Result[Result.length - 1] === "&") {
					Result = Result.substr(0, Result.length - 1);
				}
				
				//Return the full string in lowercase for best compatibility
				return Result.toLowerCase();
			};//end Serialize()
			
			
			this.Add = function (filter, DoUpdate) {
				///	<summary>
				///		1: Add(filter, DoUpdate) - adds the array/valuetype to the filter collection and allows an update to occur
            	///		2: Add(filter) - adds the array/valuetype to the filter collection and no update occurs.
				///	</summary>
				///	<param name="filter" type="Array, ValueType">
				///		1: Array - An array of objects/values to be added into the Filters array
				///		1: ValueType - a single object or ValueType to be added to the Filters array
				///	</param>
				///	<param name="DoUpdate" type="Boolean">
				///		1: Boolean - Value that signifies that an update is to occur after an add
				///	</param>
				///	<returns type="void" />
				
				//Handles array and single value pushes to the history
				if ($.isArray(filter)) {
					//concat the new filters array onto the current Filters array
					Filters = Filters.concat(filter);
				} else {
					//push the filter onto the end of the Filters array
					Filters.push(filter);
				}
				
				//Cause the history object to update the hash if a true value is provided
				if (DoUpdate !== null && DoUpdate) {
					this.Update();
				}
			};//end this.Add(...)


			this.Remove = function (filter) {
				///	<summary>
				///		1: Remove(filter) - Finds and removes the specified filter from the Filter array
				///	</summary>
				///	<param name="filter" type="Array, ValueType">
				///		1: Array - An array of objects/values to be removed from the Filters array
				///	</param>
				///	<returns type="void" />
				
				var tmp = []; //temporary holder of Filters during processing
				
				//search through the entire filter collection
				for (var i = 0; i < Filters.length; i++) {
					//if the filter is an object and it is not the same as the filter object we want to remove
					//or if the filter is not an object and the fitler is not the same as the filter value we want to remove
					if (typeof (Filters[i]) === "object" && !$.ObjectCompare(Filters[i], filter) ||
						typeof (Filters[i]) !== "object" && Filters[i] !== filter) {
						
						//add to the temporary array to preserve it
						tmp.push(Filters[i]);
					}
				}
				
				//Reassign the temporary holders back into the master Filters array
				Filters = tmp;
				
				//Push an update
				this.Update();
			};//end this.Remove(...)


			this.Has = function (filter) {
				///	<summary>
				///		1: Has(filter) - Search for a filter in the Filters array and return the search result
				///	</summary>
				///	<param name="filter" type="Array, ValueType">
				///		1: Array - An array of objects/values to be found in the Filters array
				///	</param>
				///	<returns type="Boolean" />
				
				//process and inspect all filters in the Filters array
				for (var i = 0; i < Filters.length; i++) {
					
					//Current Filter is an object and the current Filter is the same as the filter
					//or Current Filter is a string and the filter is a string and that both their lowercase values are the same
					//or Current Filter is not an object and the current Filter is the same as the filter
					if (typeof (Filters[i]) === "object" && ObjectCompare(Filters[i], filter) ||
					   typeof (Filters[i]) === "string" && filter === "string" && Filters[i].toLowerCase() === filter.toLowerCase() ||
					   typeof (Filters[i]) !== "object" && Filters[i] === filter) {
						return true;
					}
				}
				return false;
			};//end this.Has(...)
			
			
			this.Update = function () {
				///	<summary>
				///		1: Update() - Serialize and update the hash string with the processed values
				///	</summary>
				///	<returns type="void" />
				location.hash = Serialize();
			};//end this.Update()
    	}//end History Definition
	});//end $.extend
})(jQuery);
