CC=gcc
CFLAGS=-O
OBJS=md5.o rebootroute.o
rebootroute:${OBJS}
	${CC}  -o rebootroute  -lm -lssl ${CFLAGS} ${OBJS}
clean:
	rm -rfv ${TARGET} ${OBJS} rebootroute
debug:${OBJS}
	${CC} -g -lm -lssl  ${CFLAGS} ${OBJS}

