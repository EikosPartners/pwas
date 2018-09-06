import { shallowMount } from "@vue/test-utils";
import Grid from "@/components/Grid.vue";

// describe("Grid.vue", () => {
//   it("renders grid when data exists", () => {
//     const wrapper = shallowMount(Grid, {
//       data: [
//         {
//           date: "2017-02-08",
//           volume: 1
//         }
//       ],
//       columns: [
//         { headerName: date, field: date },
//         { headerName: volume, field: volume }
//       ]
//     });
//     expect(wrapper.text()).toMatch(msg);
//   });
// });

test("parseInt transforms date correctly", () => {
  const input = "2018-02-20T06:10:29.000Z";
  const output = "02-20-2018 : 06 10 29";
  expect(this.parseDate(input)).toEqual(output);
});
