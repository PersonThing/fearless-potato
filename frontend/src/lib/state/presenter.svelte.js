let name = $state('');

export const presenter = {
  get name() {
    return name;
  },
  get hasName() {
    return name.trim().length > 0;
  },

  setName(val) {
    name = val;
  },
};
