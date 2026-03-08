// import { vi } from 'vitest';

// // --- Mock next/headers ---
// const mockCookieStore = {
//     getAll: vi.fn().mockReturnValue([]),
//     set: vi.fn(),
//     get: vi.fn(),
//     delete: vi.fn(),
// };

// vi.mock('next/headers', () => ({
//     cookies: vi.fn().mockResolvedValue(mockCookieStore),
//     headers: vi.fn().mockResolvedValue(new Map([['host', 'localhost:3000']])),
// }));

// // --- Mock next/cache ---
// vi.mock('next/cache', () => ({
//     revalidatePath: vi.fn(),
//     revalidateTag: vi.fn(),
// }));

// // --- Mock next/navigation ---
// vi.mock('next/navigation', () => ({
//     redirect: vi.fn(),
//     notFound: vi.fn(),
// }));
