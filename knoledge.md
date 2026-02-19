git add .
git commit -m "something"

vvvvvvvvvvvvvvvvvvvvvvvv

git commit -am "something"

---

put this "commit -ac" into an alias

git config --global alias.ac "commit -am"

vvvvvvvvvvvvvvvvvvv

git ac "something"

---

CHANGE MESSAGE OF LAST COMMIT

git commit --amend -m "new message to last commit"

---

ADD NEW FILES TO THE LAST COMMIT

git add .
git commit --amend --no-edit

note: only works when the code wasn't pushed to a remote repo

if that's the case

git push origin master -force-with-lease

will override last push with this push

but if there were files been removed

it will be lost

---

REVERT A PUSH TO A REMOTE REPO

git revert C

quita los cambios de ese commit

A > B > C > D > E
vvvvvvvvvvvvvvvvv
A > B > C > D > E > revert_C

si C agrego 2 console logs, se remueve solo eso
todo lo otro queda intacto

---

apretando > en un repositorio
se abre vs code con ese repositorio

---

STASH

git stash
meter los cambios en el bolsillo

git stash pop
traer los cambios de vuelta

git stash save coolstuff
to reference stash with name coolstuff

git stash list
git stash apply [index] 0

---

GRAH HISTORY OF COMMITS

git log --graph --online --decorate

---

git bisect to be explained

---

SQUASH COMMITS

git rebase master --interactive

to be explained

git rebase -i --autosquash

to be explained

---
