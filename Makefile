CC=gcc
CFLAGS=-O
OBJS=md5.o rebootroute.o
OBJSDEBUG=rebootroute.c
rebootroute:${OBJS}
	${CC}  -o rebootroute  -lm -lssl ${CFLAGS} ${OBJS}
clean:
	rm -rfv ${OBJS} rebootroute *.out debug
debug:${OBJSDEBUG}
	${CC} -g -lm -lssl  -o debug  ${OBJSDEBUG}

