CC=gcc
CFLAGS=-O
OBJS=md5.o rebootroute.o
OBJSDEBUG=rebootroute.c
rebootroute:${OBJS}
	${CC}  -o rebootroute  -lcrypto -lm  ${CFLAGS} ${OBJS}
clean:
	rm -rfv ${OBJS} rebootroute *.out debug
debug:${OBJSDEBUG}
	${CC} -g -lm  -lcrypto  -o debug  ${OBJSDEBUG}

