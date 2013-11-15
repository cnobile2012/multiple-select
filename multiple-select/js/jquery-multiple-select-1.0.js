/*
 * jquery-multiple-select-1.0.js
 *
 * Requires: inheritance.js (By John Resig http://ejohn.org/)
 *
 * Carl J. Nobile
 */

/*
 * The MultipleSelectBox class takes data in the following format:
 * [[0, "text"], [1, "text"], ...]
 */
var MultiChoiceBox = Class.extend({
  init: function(errorTag) {
    this._super(errorTag);
    this.__mcbAData = null;
    this.__mcbCData = null;
    this.__chosenData = {};
    this.__sort = true;
  },

  setData: function(aData, cData, sort) {
    if(sort === undefined && cData instanceof Boolean) {
      var sort = cData;
    } else if(cData !== undefined) {
      this.__mcbCData = this.unique(this.sort(cData), 1);
    }

    if(sort !== undefined) {
      this.__sort = sort;
    }

    this.__mcbAData = this.unique(this.sort(aData), 1);
  },

  multiChoiceBox: function($availableSelect, $chosenSelect,
                           $addButton, $removeButton) {
    this.__$availableSelect = $availableSelect;
    this.__$chosenSelect = $chosenSelect;
    $availableSelect.empty();
    $chosenSelect.empty();

    if(this.__mcbCData && this.__mcbCData.length > 0) {
      var tmp = [];

      for(var j = 0; j < this.__mcbAData.length; j++) {
        var hasValue = false;

        for(var k = 0; k < this.__mcbCData.length; k++) {
          if(this.__mcbAData[j][0] === this.__mcbCData[k][0]) {
            hasValue = true;
          }
        }

        hasValue || tmp.push(this.__mcbAData[j]);
      }

      this.__mcbAData = tmp;
      this._populateSelect(this.__mcbCData, $chosenSelect);
    }

    this._populateSelect(this.__mcbAData, $availableSelect);
    var options = {self: this};
    $addButton.bind('click', options, this._addBoxData);
    $removeButton.bind('click', options, this._removeBoxData);
  },

  setChosenData: function(setName) {
    for(var i = 0; i < this.__$chosenSelect.find('option').length; i++) {
      var $option = $(this.__$chosenSelect[i]);
      var data = {};
      data['text'] = $option.text();
      data['value'] = $option.val();
    }

    this.__chosenData['setName'] = data;
    return data;
  },

  getChosenData: function(setName) {
    return this.__chosenData.setName;
  },

  removeChosenData: function() {
    this.__chosenData = {};
  },

  _addBoxData: function(event) {
    var self = event.data.self;
    var $leftSelectedOptions = self.__$availableSelect.find(':selected');
    self._populateSelect($leftSelectedOptions, self.__$chosenSelect);
    self._populateSelectWithOutSelected(self.__$availableSelect);
 },

  _removeBoxData: function(event) {
    var self = event.data.self;
    // Get the selected items.
    var $rightSelectedOptions = self.__$chosenSelect.find(':selected');
    // Rebuild select without selected items.
    self._populateSelectWithOutSelected(self.__$chosenSelect);
    var selected = [];
    var data = $.extend(true, [], this.__mcbAData);

    for(var i = 0; i < $rightSelectedOptions.length; i++) {
      var $option = $($rightSelectedOptions[i]);
      selected[i] = [$option.val(), $option.text()];
    }

    var $options = self.__$availableSelect.find('option');
    var data = selected.concat(self.convertOptionToArray($options));
    self.__$availableSelect.empty();
    self._populateSelect(data, self.__$availableSelect);
  },

  _populateSelectWithOutSelected: function($select) {
    var $included = $select.find('option').not(':selected');
    $select.empty();
    this._populateSelect($included, $select);
  },

  _populateSelect: function(data, $select) {
    var tmp = data;

    if(data instanceof jQuery ) {
      tmp = this.convertOptionToArray(data);
    }

    data = this.sort(tmp);
    var option = '<option></option>';

    for(var i = 0; i < data.length; i++) {
      var $option = $(option);
      $option.val(data[i][0]);
      $option.text(data[i][1]);
      $option.appendTo($select);
    }
  },

  /*
   * Utility methods.
   */
  convertOptionToArray: function($options) {
    var data = [];

    for(var i = 0; i < $options.length; i++) {
      data[i] = [parseInt($($options[i]).val()), $($options[i]).text()];
    }

    return data
  },

  sort: function(data) {
    if(this.__sort === true) {
      data = data.sort(this._compare);
    }

    return data;
  },

  _compare: function(a, b) {
    var result = 0;

    if (a[1] < b[1])
      result = -1;
    else if (a[1] > b[1])
      result = 1;

    return result;
  },

  /*
   * array -- [[0, 's'], [1, 'a'], [2, 'd'], [3, 'a']]
   *   idx -- Index into 2nd array.
   *
   * unique(array, 1) -> [[0, 's'], [1, 'a'], [2, 'd']]
   */
  unique: function(array, idx) {
    for(var a = [], obj = {}, i = 0; i < array.length; i++) {
      obj[array[i][idx]] || (a.push(array[i]), obj[array[i][idx]] = true);
    }

    return a;
  }
});


$(document).ready(function() {
  new MultipleSelectBox();
});
