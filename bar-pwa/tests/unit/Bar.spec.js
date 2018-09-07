import { shallowMount, mount, createLocalVue } from "@vue/test-utils";
import Bar from "@/components/BarChart.vue";
import Vuex from "vuex";
import { mockData } from "./mockData.js";
import { getters, mutations, actions } from "@/store.js";
import axios from "axios"; //imports mock axios from __mock__

const localVue = createLocalVue();

localVue.use(Vuex);

describe("BarChart PWA", () => {
  let comp;
  let store;
  let state = mockData;

  beforeEach(() => {
    store = new Vuex.Store({
      state,
      getters,
      mutations,
      actions
    });
    comp = shallowMount(Bar, { store, localVue, stubs: ["bar-chart"] });

    afterEach(() => {
      comp.destroy();
    });
  });

  it("barData() transforms date correctly", () => {
    const barData = comp.vm.$options._parentVnode.componentInstance.barData;
    const rawData = [
      {
        date: "2018-02-11T23:33:52.000Z",
        raisedBy: 6354,
        project: "Architect",
        severity: 3
      }
    ];
    expect(Object.keys(barData(rawData))).toEqual(["x", "y"]);
  });
});
