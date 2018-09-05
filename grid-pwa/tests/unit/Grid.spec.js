import { shallowMount } from "@vue/test-utils";
import Grid from "@/components/Grid.vue";

describe("Grid.vue", () => {
  it("renders grid when data exists", () => {
    const wrapper = shallowMount(Grid, {
      data: [
        {
          date: "2017-02-08",
          volume: 1
        }
      ],
      columns: [
        { headerName: date, field: date },
        { headerName: volume, field: volume }
      ]
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
