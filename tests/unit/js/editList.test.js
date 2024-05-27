import $ from 'jquery';
import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/widgets/mouse';
import 'jquery-ui/ui/widgets/sortable';
import { setupMultiInputAutocomplete } from '../../../openlibrary/plugins/openlibrary/js/autocomplete.js';

setupMultiInputAutocomplete($);

function initializeListEditHandlers() {
    $("ol.list-edit__items").setup_multi_input_autocomplete(function(index, item) {
        return `
        <li class="mia__input ac-input">
            <div class="seed--controls">
                <div class="mia__reorder mia__index">≡ #${index + 1}</div>
                <button class="mia__to_top" type="button">To top</button>
                <button class="mia__to_bottom" type="button">To bottom</button>
                <button class="mia__remove" type="button">Remove</button>
            </div>
            <main>
                <input class="ac-input__value" name="seeds--${index}--thing--key" type="hidden" value="${item.key}" />
                <input class="ac-input__visible" value="${item.key.split('/').pop()}" placeholder="Search for a book" />
                <div class="ac-input__preview">${item.key}</div>
                <textarea name="seeds--${index}--notes" placeholder="Notes (optional)">${item.notes || ''}</textarea>
            </main>
        </li>`;
    }, { allow_empty: true, sortable: true }, {});
}

describe('Multi-input autocomplete list tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
        <ol class="list-edit__items multi-input-autocomplete--seeds">
            <li class="mia__input ac-input" id="item-1">
                <div class="seed--controls">
                    <button class="mia__to_top" type="button">To top</button>
                    <button class="mia__to_bottom" type="button">To bottom</button>
                    <button class="mia__remove" type="button">Remove</button>
                </div>
            </li>
            <li class="mia__input ac-input" id="item-2">
                <div class="seed--controls">
                    <button class="mia__to_top" type="button">To top</button>
                    <button class="mia__to_bottom" type="button">To bottom</button>
                    <button class="mia__remove" type="button">Remove</button>
                </div>
            </li>
        </ol>`;
        initializeListEditHandlers(); // Reinitialize handlers
    });

    test('Buttons are created correctly', () => {
        expect($('.mia__to_top').length).toBe(2);
        expect($('.mia__to_bottom').length).toBe(2);
        expect($('.mia__remove').length).toBe(2);
    });

    test('To top button moves item to the top', (done) => {
        $('#item-2 .mia__to_top').trigger('click');
        setTimeout(() => {
            expect($('.list-edit__items .mia__input').first().attr('id')).toBe('item-2');
            done();
        }, 500);
    });

    test('To bottom button moves item to the bottom', (done) => {
        $('#item-1 .mia__to_bottom').trigger('click');
        setTimeout(() => {
            expect($('.list-edit__items .mia__input').last().attr('id')).toBe('item-1');
            done();
        }, 500);
    });

    test('Remove button removes an item', (done) => {
        $('#item-1 .mia__remove').trigger('click');
        setTimeout(() => {
            expect($('#item-1').length).toBe(0);
            expect($('.mia__input').length).toBe(1);
            done();
        }, 500);
    });
});
