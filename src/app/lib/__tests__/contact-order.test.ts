import {
  getContactOrder,
  getContactOrderAfterAdditionalFieldDeletion,
} from "lib/contact-order";
import { initialProfile } from "lib/redux/resumeSlice";

describe("contact order", () => {
  it("appends fields missing from legacy order data", () => {
    expect(
      getContactOrder({
        ...initialProfile,
        contactOrder: ["url", "email"],
        additionalFields: ["LinkedIn"],
      })
    ).toEqual(["url", "email", "phone", "location", "additional-0"]);
  });

  it("renumbers additional fields after deletion", () => {
    expect(
      getContactOrderAfterAdditionalFieldDeletion(
        ["email", "additional-2", "additional-0", "additional-1"],
        1
      )
    ).toEqual(["email", "additional-1", "additional-0"]);
  });
});
