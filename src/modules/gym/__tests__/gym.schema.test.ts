import { describe, it } from 'vitest';
import { createGymSchema, gymSchema, updateGymSchema } from '../gym.schema';
import { expectFieldError, expectInvalid, expectValid } from './gym.helpers';
import { GymMother } from './gym.mother';

describe('gymSchema', () => {
    describe('valid input', () => {
        it('should accept a complete valid gym', () => {
            expectValid(gymSchema, GymMother.valid());
        });
    });

    describe('invalid input', () => {
        // Name Field
        it('should reject when name is missing', () => {
            expectFieldError(gymSchema, GymMother.withoutName(), 'name');
        });

        it('should reject when name is blank', () => {
            expectFieldError(gymSchema, GymMother.withBlankName(), 'name');
        });

        it('should reject when name is too short', () => {
            expectFieldError(gymSchema, GymMother.withTooShortName(), 'name');
        });

        it('should reject when name is too long', () => {
            expectFieldError(gymSchema, GymMother.withTooLongName(), 'name');
        });

        // Subscription Status Field
        it('should reject when subscription status is missing', () => {
            expectFieldError(gymSchema, GymMother.withoutSubStatus(), 'subscription_status');
        });

        it('should reject when subscription status is blank', () => {
            expectFieldError(gymSchema, GymMother.withBlankSubStatus(), 'subscription_status');
        });

        it('should reject when subscription status is too short', () => {
            expectFieldError(gymSchema, GymMother.withTooShortSubStatus(), 'subscription_status');
        });

        it('should reject when subscription status is too long', () => {
            expectFieldError(gymSchema, GymMother.withTooLongSubStatus(), 'subscription_status');
        });

        // Coach Admin Field
        it('should reject when coach admin is missing', () => {
            expectFieldError(gymSchema, GymMother.withoutCoachAdmin(), 'coach_admin');
        });

        it('should reject when coach admin is blank', () => {
            expectFieldError(gymSchema, GymMother.withBlankCoachAdmin(), 'coach_admin');
        });

        it('should reject when coach admin is invalid', () => {
            expectFieldError(gymSchema, GymMother.withInvalidCoachAdmin(), 'coach_admin');
        });
    });

    describe('edge cases', () => {
        it('should reject an empty object', () => {
            expectInvalid(gymSchema, GymMother.empty());
        });
    });
});

describe('createGymSchema', () => {
    describe('valid input', () => {
        it('should accept valid create data without id', () => {
            expectValid(createGymSchema, GymMother.createValid());
        });
    });

    it('should accept valid create data with optional logo_url', () => {
        expectValid(createGymSchema, GymMother.createWithValidLogoUrl());
    });

    it('should accept valid create data without logo_url', () => {
        expectValid(createGymSchema, GymMother.createWithoutLogoUrl());
    });

    describe('invalid input', () => {
        it('should reject when name is missing', () => {
            expectFieldError(createGymSchema, GymMother.withBlankName(), 'name');
        });

        it('should reject when coach admin is missing', () => {
            expectFieldError(createGymSchema, GymMother.withoutCoachAdmin(), 'coach_admin');
        });
    });
});

describe('updateGymSchema', () => {
    describe('valid input', () => {
        it('should accept valid update data with id', () => {
            expectValid(updateGymSchema, GymMother.updateWithId());
        });
    });

    describe('invalid input', () => {
        it('should reject when id is missing', () => {
            expectFieldError(updateGymSchema, GymMother.updateWithoutId(), 'id');
        });

        it('should reject when id is blank', () => {
            expectFieldError(updateGymSchema, GymMother.updateWithBlankId(), 'id');
        });
    });
});
