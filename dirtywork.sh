for f in out/*.png; do
    gm convert $f $f.gif
done

for f in out2/*.png; do
    gm convert $f $f.gif
done

gifsicle --colors 256 --loop -d10 out/*.gif out2/*.gif > animation.gif
