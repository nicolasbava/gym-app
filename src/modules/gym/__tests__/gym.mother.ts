import z from 'zod';
import { gymSchema } from '../gym.schema';

type GymInput = z.infer<typeof gymSchema>;

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000';

const gymMock = {
    name: 'Iron Paradise',
    subscription_status: 'valid',
    logo_url: 'gmys/imgae_name.png',
    coach_admin: VALID_UUID,
    id: VALID_UUID,
    created_at: new Date(),
};

export const GymMother = {
    valid: (): GymInput => ({ ...gymMock }),

    // Name Field
    withoutName: (): Omit<GymInput, 'name'> => {
        const { name, ...rest } = gymMock;
        return rest;
    },

    withBlankName: (): GymInput => {
        const { name, ...rest } = gymMock;
        return { name: '', ...rest };
    },

    withTooShortName: (): GymInput => {
        const { name, ...rest } = gymMock;
        return { name: 'El', ...rest };
    },

    withTooLongName: (): GymInput => {
        const { name, ...rest } = gymMock;
        return { name: 'a'.repeat(51), ...rest };
    },

    // Subscription Status Field
    withoutSubStatus: (): Omit<GymInput, 'subscription_status'> => {
        const { subscription_status, ...rest } = gymMock;
        return { ...rest };
    },

    withBlankSubStatus: (): GymInput => {
        const { subscription_status, ...rest } = gymMock;
        return { subscription_status: '', ...rest };
    },

    withTooShortSubStatus: (): GymInput => {
        const { subscription_status, ...rest } = gymMock;
        return { subscription_status: 'aaa', ...rest };
    },

    withTooLongSubStatus: (): GymInput => {
        const { subscription_status, ...rest } = gymMock;
        return { subscription_status: 'a'.repeat(11), ...rest };
    },

    // Coach Admin Field
    withoutCoachAdmin: (): Omit<GymInput, 'coach_admin'> => {
        const { coach_admin, ...rest } = gymMock;
        return { ...rest };
    },
    withBlankCoachAdmin: (): GymInput => {
        const { coach_admin, ...rest } = gymMock;
        return { coach_admin: '', ...rest };
    },
    withInvalidCoachAdmin: (): GymInput => {
        const { coach_admin, ...rest } = gymMock;
        return { coach_admin: 'invalid-uuid', ...rest };
    },

    // Create Actions
    createValid: (): GymInput => ({ ...gymMock }),
    createWithoutLogoUrl: (): GymInput => {
        const { logo_url, ...rest } = gymMock;
        return { ...rest };
    },
    createWithValidLogoUrl: (): GymInput => ({ ...gymMock }),

    // Update Actions
    updateWithId: (): GymInput => {
        const { id, ...rest } = gymMock;
        return { id: VALID_UUID, ...rest };
    },
    updateWithoutId: (): Omit<GymInput, 'id'> => {
        const { id, ...rest } = gymMock;
        return { ...rest };
    },
    updateWithoutLogoUrl: (): GymInput => {
        const { logo_url, ...rest } = gymMock;
        return { ...rest };
    },
    updateWithBlankId: (): GymInput => {
        const { id, ...rest } = gymMock;
        return { id: '', ...rest };
    },
    updateWithInvalidId: (): GymInput => {
        const { id, ...rest } = gymMock;
        return { id: 'invalid-uuid', ...rest };
    },

    // Edge cases
    empty: (): Record<string, never> => ({}),
};

// Refactor idea
// const createGymMock = {
//     name: 'Iron Paradise',
//     subscription_status: 'valid',
//     logo_url: 'gyms/image_name.png',
//     coach_admin: VALID_UUID,
// };
// const updateGymMock = {
//     ...createGymMock,
//     id: VALID_UUID,
// };
// export const CreateGymMother = {
//     valid: () => ({ ...createGymMock }),
//     withoutName: () => {
//         const { name, ...rest } = createGymMock;
//         return rest;
//     },
//     withoutCoachAdmin: () => {
//         const { coach_admin, ...rest } = createGymMock;
//         return rest;
//     },
//     withoutLogoUrl: () => {
//         const { logo_url, ...rest } = createGymMock;
//         return rest;
//     },
// };
// export const UpdateGymMother = {
//     valid: () => ({ ...updateGymMock }),
//     withoutId: () => {
//         const { id, ...rest } = updateGymMock;
//         return rest;
//     },
//     withBlankId: () => ({ ...updateGymMock, id: '' }),
//     withoutName: () => {
//         const { name, ...rest } = updateGymMock;
//         return rest;
//     },
// };
