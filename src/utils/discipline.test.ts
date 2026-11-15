import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_FOOD_CATEGORIES,
  DEFAULT_HABITS,
  DEFAULT_STUDY_CATEGORIES,
} from '../data/defaults';
import {
  adjustFoodCategory,
  adjustStudyCategory,
  calculateDisciplineScore,
  getDisciplineStatusLabel,
  getHeatmapIntensity,
  getTotalStudyHours,
  reorderHabits,
  toggleHabitItem,
  validateBackgroundUrl,
} from './discipline';

test('calculateDisciplineScore computes expected default score of 51%', () => {
  const study = getTotalStudyHours(DEFAULT_STUDY_CATEGORIES);
  assert.equal(study.logged, 4.5);
  assert.equal(study.target, 5.5);

  const score = calculateDisciplineScore({
    habits: DEFAULT_HABITS,
    sleepHours: 7.5,
    ateClean: false,
    waterMl: 2250,
    studyLogged: study.logged,
    studyTarget: study.target,
  });
  assert.equal(score, 51);
});

test('calculateDisciplineScore hits 100% when all targets are satisfied', () => {
  const allDone = DEFAULT_HABITS.map((h) => ({ ...h, completed: true }));
  const score = calculateDisciplineScore({
    habits: allDone,
    sleepHours: 8.5,
    ateClean: true,
    waterMl: 3000,
    studyLogged: 6,
    studyTarget: 5.5,
  });
  assert.equal(score, 100);
  assert.equal(getDisciplineStatusLabel(score), 'Flawless Execution — Unstoppable');
});

test('toggleHabitItem flips completion, updates streak, and syncs today weekHistory slot', () => {
  const updated = toggleHabitItem(DEFAULT_HABITS, '3');
  const toggled = updated.find((h) => h.id === '3');
  assert.ok(toggled);
  assert.equal(toggled.completed, true);
  assert.equal(toggled.streak, 5);
  assert.equal(toggled.weekHistory[6], true);

  const reverted = toggleHabitItem(updated, '3').find((h) => h.id === '3');
  assert.ok(reverted);
  assert.equal(reverted.completed, false);
  assert.equal(reverted.streak, 4);
  assert.equal(reverted.weekHistory[6], false);
});

test('reorderHabits moves items safely within bounds', () => {
  const movedUp = reorderHabits(DEFAULT_HABITS, 2, -1);
  assert.equal(movedUp[1].id, '3');
  assert.equal(movedUp[2].id, '2');

  const boundary = reorderHabits(DEFAULT_HABITS, 0, -1);
  assert.deepEqual(
    boundary.map((h) => h.id),
    DEFAULT_HABITS.map((h) => h.id)
  );
});

test('adjustFoodCategory and adjustStudyCategory clamp at zero', () => {
  const food = adjustFoodCategory(DEFAULT_FOOD_CATEGORIES, 'protein', -500);
  assert.equal(food.find((c) => c.id === 'protein')?.current, 0);

  const study = adjustStudyCategory(DEFAULT_STUDY_CATEGORIES, 'study_2', 0.5);
  assert.equal(study.find((c) => c.id === 'study_2')?.logged, 1.5);
});

test('getHeatmapIntensity maps scores into 0-4 tiers', () => {
  assert.equal(getHeatmapIntensity(95), 4);
  assert.equal(getHeatmapIntensity(75), 3);
  assert.equal(getHeatmapIntensity(51), 2);
  assert.equal(getHeatmapIntensity(20), 1);
  assert.equal(getHeatmapIntensity(0), 0);
});

test('validateBackgroundUrl accepts https, local assets, and data URLs while rejecting invalid input', () => {
  assert.equal(validateBackgroundUrl('').valid, false);
  assert.equal(validateBackgroundUrl('not a url').valid, false);
  assert.equal(validateBackgroundUrl('javascript:alert(1)').valid, false);
  assert.equal(validateBackgroundUrl('https://example.com/bg.jpg').valid, true);
  assert.equal(validateBackgroundUrl('/assets/aistudio/gojo_wallpaper_90f1da84.jpg').valid, true);
  assert.equal(validateBackgroundUrl('data:image/png;base64,AAA').valid, true);
});
