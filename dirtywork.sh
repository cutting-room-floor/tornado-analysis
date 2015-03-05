# for f in out/*.png; do
#     gm convert $f $f.gif
# done
# 
# for f in out2/*.png; do
#     gm convert $f $f.gif
# done

gifsicle -O3 --colors 32 --loop -d5 out/*.gif out2/*.gif > animation.gif
