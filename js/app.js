'use strict';

function Picture(data) {
    this.image_url = data.image_url;
    this.title = data.title;
    this.description = data.description;
    this.keyword = data.keyword;
    this.horns = data.horns;
    Picture.all.push(this);
}

Picture.all = [];

Picture.prototype.render = function() {

    let templateMarkup = $('#animal-wrap').html();
    let template = Handlebars.compile(templateMarkup);
    let galleryOutput = template(this);
    $('#photo-template').append(galleryOutput);
    $('div').hide();
    $('div').fadeIn(900);
}

$(document).ready(function() {
    let rand = Math.ceil(Math.random() * 2)
    renderInformation(rand);
});

function renderOptions() {
    let showed = [];
    $('.filterList').html('');

    Picture.all.forEach(animal => {
        for (let i = -1; i < showed.length; i++) {
            if (showed[i] != animal.keyword) {
                $('.filterList').append(`<option value ="${animal.keyword}">${animal.keyword}</option>`);
                showed[i] = animal.keyword;
            }
        }
    });
}

function renderdependonsorttype() {
    $('.sort').on('change', function() {
        if ($('.sort').val() == 'title') {
            sortbytitle();
            $('#photo-template').html('');
            Picture.all.forEach(animal => {
                animal.render();
            });
        } else if ($('.sort').val() == 'number') {
            sortbynumber();
            $('#photo-template').html('');
            Picture.all.forEach(animal => {
                animal.render();
            });
        }
    });
}

function sortbytitle() {
    Picture.all.sort(function(a, b) {
        let firstName = a.title;
        let secondName = b.title;
        if (firstName < secondName) {
            return -1;
        }
        if (firstName > secondName) {
            return 1;
        }
        return 0;
    })
}

function sortbynumber() {
    Picture.all.sort(function(a, b) {
        let firstNum = a.horns;
        let secondNum = b.horns;
        if (firstNum < secondNum) {
            return -1;
        }
        if (firstNum > secondNum) {
            return 1;
        }
        return 0;
    })
}

$('.filterList').on('change', function() {
    let chosen = $(this).val();
    $('div').hide();
    $(`.${chosen}`).fadeIn(999);
});

$('button').click(function() {
    let number = $(this).attr('id');
    renderInformation(number);
});

function renderInformation(number) {
    $('#photo-template').html('');
    Picture.all = [];
    $.getJSON(`../data/page-${number}.json`, function(data) {
        $.each(data, function(key, val) {
            let single = new Picture(val);
            single.render()
        });
        renderOptions()
        renderdependonsorttype()
    });
}