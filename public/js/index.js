$(document).ready(function() {
    const brandSelect = $('#brand');
    const modelSelect = $('#model');
    const bandSelect = $('#band');

    Object.keys(data).sort().forEach(function(brand) {
        brandSelect.append($('<option>', {
            value: brand,
            text: brand
        }));
    });

    brandSelect.change(function() {
        modelSelect.empty().append($('<option>', { text: 'Select a model' })).prop('disabled', false);
        bandSelect.empty().append($('<option>', { text: 'Select a band' })).prop('disabled', true);
        const models = data[this.value];

        if (!models){
            return;
        }

        Object.keys(models).sort().forEach(function(model) {
            modelSelect.append($('<option>', {
                value: model,
                text: model
            }));
        });
    });

    modelSelect.change(function() {
        bandSelect.empty().append($('<option>', { text: 'Select a band' })).prop('disabled', false);
        const bands = data[brandSelect.val()][this.value];
        bands.forEach(function(band) {
            bandSelect.append($('<option>', {
                value: band,
                text: band
            }));
        });
    });
});