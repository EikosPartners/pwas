import { shallowMount, createLocalVue } from "@vue/test-utils";
// import app from "@/components/App.vue";
import Grid from "@/components/Grid.vue";
import Vuex from "vuex";
import { mockData } from "./mockData.js";
import { getters, mutations, actions } from "@/store.js";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("Grid PWA", () => {
  let store;
  let state = mockData;

  beforeEach(() => {
    store = new Vuex.Store({
      state,
      getters,
      mutations,
      actions
    });
  });

  it("renders", () => {
    const wrapper = shallowMount(Grid, { store, localVue });
    expect(wrapper.contains("div")).toBe(true);
  });

  it("renders a grid", () => {
    const wrapper = shallowMount(Grid, { store, localVue });
    expect(wrapper.vm.$children[0].$options._componentTag).toBe("ag-grid-vue");
  });

  it("data getter returns data", () => {
    const result = getters.data(state);
    expect(result).toEqual(mockData.data);
  });

  it("columns getter returns column object", () => {
    const result = getters.columns(state);
    expect(result).toEqual(mockData.columns);
  });

  it("addData mutation replaces state.data with fetched data", () => {});

  // it("generateColumns creates column object from data", () => {

  // });
});
