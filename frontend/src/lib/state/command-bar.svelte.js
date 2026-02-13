let isOpen = $state(false);
let input = $state('');
let isLoading = $state(false);
let mode = $state('create'); // 'create' | 'replace' | 'update'
let toolActivity = $state([]);
let error = $state('');

export const commandBar = {
  get isOpen() {
    return isOpen;
  },
  get input() {
    return input;
  },
  get isLoading() {
    return isLoading;
  },
  get mode() {
    return mode;
  },
  get toolActivity() {
    return toolActivity;
  },
  get error() {
    return error;
  },

  open(hasExistingContent = false) {
    isOpen = true;
    input = '';
    error = '';
    toolActivity = [];
    mode = 'create';
  },

  close() {
    isOpen = false;
    input = '';
    isLoading = false;
    error = '';
    toolActivity = [];
  },

  setInput(val) {
    input = val;
  },

  setMode(m) {
    mode = m;
  },

  setLoading(val) {
    isLoading = val;
  },

  setToolActivity(calls) {
    toolActivity = calls;
  },

  setError(msg) {
    error = msg;
  },
};
