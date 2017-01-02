import ApplicationState from '../state/application-state'

test('ApplicationState can be constructed', () => {
  const state = new ApplicationState({
      data: {},
      metadata: {
          nav: {}
      }
  });
});


test('ApplicationState can set cognito data', () => {
  const state = new ApplicationState({
      data: {
          lists: [{
              key: '1',
              name: 'aaa',
              items: [{
                  key: '100',
                  name: 'xxx',
                  completed: false
              }, {
                  key: 'baditem',
                  name: 'badlistname',
                  completed: true
              }]
          }, 
          {
              key: 'badlist',
              name: 'badlistname',
              items: []
          }]
      },
      metadata: {
          nav: {}
      }
  });

  state.synchronizeWithCognito({
      'list:1': '{ "name": "abc" }',
      'list:1:item:100': '{ "name": "xyz", "completed": true }',
      'list:1:item:101': '{ "name": "newitem1", "completed": false }',
      'list:2': '{ "name": "newlist1" }',
      'list:2:item:201': '{ "name": "newitem2", "completed": true }'
  });

    expect(state.data().lists.length).toBe(2);
    expect(state.data().lists[0].key).toBe("1");
    expect(state.data().lists[0].name).toBe("abc");
    expect(state.data().lists[0].items.length).toBe(2);
    expect(state.data().lists[0].items[0].key).toBe("100");
    expect(state.data().lists[0].items[0].name).toBe("xyz");
    expect(state.data().lists[0].items[0].completed).toBe(true);
    expect(state.data().lists[0].items[1].key).toBe("101");
    expect(state.data().lists[0].items[1].name).toBe("newitem1");
    expect(state.data().lists[0].items[1].completed).toBe(false);
    expect(state.data().lists[1].key).toBe("2");
    expect(state.data().lists[1].name).toBe("newlist1");
    expect(state.data().lists[1].items.length).toBe(1);
    expect(state.data().lists[1].items[0].key).toBe("201");
    expect(state.data().lists[1].items[0].name).toBe("newitem2");
    expect(state.data().lists[1].items[0].completed).toBe(true);
});