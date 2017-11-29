CC=gcc
CFLAGS=-O
OBJS=md5.o rebootroute.o
rebootroute:${OBJS}
	${CC} -o rebootroute ${CFLAGS} ${OBJS}
clean:
	rm -rfv ${TARGET} ${OBJS} rebootroute
