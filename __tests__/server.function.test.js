const server =require('../lib/server.js');

describe ('Testing our performAction function', () => {
  it('returns correct result for !roll', () => {
    let message = '!Roll 2d6+3';

    let result = server.performActions(message);

    expect(result).toEqual(expect.not.stringContaining('invalid command'));
  });

  it('returns correct result for !color', () => {
    let message = '!color';

    let result = server.performActions(message);

    expect(result).toEqual(expect.not.stringContaining('invalid command'));
  });

  it('returns correct result for !name', () => {
    let message = '!name';

    let result = server.performActions(message);

    expect(result).toEqual(expect.not.stringContaining('invalid command'));
  });

  it('returns correct result for !boolean', () => {
    let message = '!boolean';

    let result = server.performActions(message);

    expect(result).toBe('true' || 'false');
  });

  it('returns correct result for invalid', () => {
    let message = '!abc';

    let result = server.performActions(message);

    expect(result).toBe('invalid command');
  });

});