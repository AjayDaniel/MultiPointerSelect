import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('two-cursor-selection', 'Integration | Component | two cursor selection', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{two-cursor-selection}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#two-cursor-selection}}
      template block text
    {{/two-cursor-selection}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
