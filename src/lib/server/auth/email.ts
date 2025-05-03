import prisma from "$lib/server/prisma";

/**
 * Verifies that the provided email address is in a valid format and does not exceed the length limit.
 *
 * The function tests the email against a basic regular expression to check that it contains an '@' symbol and a period.
 * It also ensures that the email length is less than 256 characters.
 *
 * @param {string} email - The email address to be validated.
 * @returns {boolean} Returns true if the email format is valid and within the allowed length; otherwise, returns false.
 */
export function verifyEmailInput(email: string): boolean {
  return /^.+@.+\..+$/.test(email) && email.length < 256;
}

/**
 * Checks whether the provided email address is available for registration.
 *
 * This function queries the database for the count of user records with the given email.
 * If no records are found (count is zero), the email is considered available.
 *
 * @param {string} email - The email address to check for availability.
 * @returns {Promise<boolean>} A promise that resolves to true if the email is available, and false if it is already in use.
 * @throws {Error} Throws an error if the database query returns a null result.
 */
export async function checkEmailAvailability(email: string): Promise<boolean> {
  const row = await prisma.user.count({
    where: {
      email,
    },
  });
  if (row === null) {
    throw new Error();
  }
  return row === 0;
}
