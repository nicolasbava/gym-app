import { Exercise, mockExercises } from '@/src/lib/mock-data';
import { Edit2, Image as ImageIcon, Play, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

export default function ExercisesPage() {
    const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
    const [formData, setFormData] = useState<Partial<Exercise>>({
        name: '',
        description: '',
        videoUrl: '',
        imageUrl: '',
        muscleGroup: 'Chest',
        equipment: '',
        instructions: [''],
    });

    const handleOpenModal = (exercise?: Exercise) => {
        if (exercise) {
            setEditingExercise(exercise);
            setFormData(exercise);
        } else {
            setEditingExercise(null);
            setFormData({
                name: '',
                description: '',
                videoUrl: '',
                imageUrl: '',
                muscleGroup: 'Chest',
                equipment: '',
                instructions: [''],
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingExercise(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingExercise) {
            setExercises(exercises.map((ex) => (ex.id === editingExercise.id ? ({ ...formData, id: ex.id } as Exercise) : ex)));
        } else {
            const newExercise: Exercise = {
                ...formData,
                id: `ex${Date.now()}`,
            } as Exercise;
            setExercises([...exercises, newExercise]);
        }

        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this exercise?')) {
            setExercises(exercises.filter((ex) => ex.id !== id));
        }
    };

    const updateInstruction = (index: number, value: string) => {
        const newInstructions = [...(formData.instructions || [''])];
        newInstructions[index] = value;
        setFormData({ ...formData, instructions: newInstructions });
    };

    const addInstruction = () => {
        setFormData({ ...formData, instructions: [...(formData.instructions || ['']), ''] });
    };

    const removeInstruction = (index: number) => {
        const newInstructions = (formData.instructions || ['']).filter((_, i) => i !== index);
        setFormData({ ...formData, instructions: newInstructions });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Exercise Library</h2>
                    <p className="text-gray-600 mt-1">Manage all exercises for your gym</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Exercise
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exercises.map((exercise) => (
                    <div key={exercise.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-48 bg-gray-200">
                            <img src={exercise.imageUrl} alt={exercise.name} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button onClick={() => handleOpenModal(exercise)} className="p-2 bg-white rounded-lg shadow hover:bg-gray-50">
                                    <Edit2 className="w-4 h-4 text-gray-700" />
                                </button>
                                <button onClick={() => handleDelete(exercise.id)} className="p-2 bg-white rounded-lg shadow hover:bg-red-50">
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">{exercise.name}</h3>
                            <div className="flex gap-2 mb-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{exercise.muscleGroup}</span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{exercise.equipment}</span>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2">{exercise.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold">{editingExercise ? 'Edit Exercise' : 'Add New Exercise'}</h3>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Muscle Group</label>
                                    <select
                                        value={formData.muscleGroup}
                                        onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option>Chest</option>
                                        <option>Back</option>
                                        <option>Legs</option>
                                        <option>Shoulders</option>
                                        <option>Arms</option>
                                        <option>Core</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
                                    <input
                                        type="text"
                                        value={formData.equipment}
                                        onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Barbell, Dumbbells"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center gap-2">
                                        <Play className="w-4 h-4" />
                                        Video URL
                                    </div>
                                </label>
                                <input
                                    type="url"
                                    value={formData.videoUrl}
                                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        Image URL
                                    </div>
                                </label>
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                                <div className="space-y-2">
                                    {(formData.instructions || ['']).map((instruction, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={instruction}
                                                onChange={(e) => updateInstruction(index, e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder={`Step ${index + 1}`}
                                            />
                                            {(formData.instructions?.length || 0) > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeInstruction(index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={addInstruction} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                        + Add Step
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                                    {editingExercise ? 'Update Exercise' : 'Create Exercise'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
